import { CollectionAfterChangeHook } from 'payload';
import { Tenant } from '@/types/payload';

type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

type WeekOfMonth = '1st' | '2nd' | '3rd' | '4th' | 'last';

type workOrderRecurrence = {
  type: string;
  interval: number;
  details: {
    daysOfWeek: { day: DayOfWeek }[];
    dateOfMonth: number;
    weekdayOfMonth: {
      week: WeekOfMonth;
      day: DayOfWeek;
    };
    monthOfYear: number;
  };
};

const weekdayMap: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const calculateNewDate = ({
  recurrence,
  startDate,
  dueDate,
  workingDays,
}: {
  recurrence: workOrderRecurrence;
  startDate: Date;
  dueDate: Date;
  workingDays: string[];
}) => {
  const newOrderDate = {
    start: startDate,
    due: dueDate,
  };

  if (!recurrence.type || !recurrence.interval) {
    // console.log('--------No recurrence type or interval provided----------');
    return newOrderDate;
  }

  switch (recurrence.type) {
    case 'none':
      return null;

    case 'daily':
      // a loop that advances the date only when the next day is a working day
      // and skips non-working days
      let daysAdded = 0;
      let currentDate = new Date(newOrderDate.start);
      while (daysAdded < recurrence.interval) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayName = currentDate
          .toLocaleDateString('en-US', {
            weekday: 'short',
          })
          .toLocaleLowerCase();

        if (workingDays.includes(dayName)) {
          daysAdded++;
        }
      }
      newOrderDate.due = currentDate;
      break;

    case 'weekly': {
      newOrderDate.due =
        getNextRecurrenceDateByWeekday(
          recurrence.interval,
          recurrence.details.daysOfWeek.map((day) => day.day),
          newOrderDate.start,
        ) || newOrderDate.due;

      break;
    }
    case 'monthlyByDate':
      // To ensure the time is consistent and avoid unexpected offsets,
      // setting explicitly the time to 00:00:00 in UTC
      newOrderDate.due = new Date(
        Date.UTC(
          newOrderDate.start.getFullYear(),
          newOrderDate.start.getMonth() + recurrence.interval,
          recurrence.details.dateOfMonth,
        ),
      );
      break;

    case 'monthlyByWeekday': {
      newOrderDate.due = getNextRecurrenceDateMonthlyByWeekday(
        recurrence,
        newOrderDate.start,
      );
      break;
    }

    case 'yearly':
      newOrderDate.due = new Date(
        Date.UTC(
          newOrderDate.due.getFullYear() + recurrence.interval,
          recurrence.details.monthOfYear - 1,
          1, // Set to the first day of the month
        ),
      );
      break;
    default:
      return newOrderDate;
  }

  return newOrderDate;
};

/**
 * Calculates the next recurrence date based on the specified interval in weeks
 * and the desired weekdays for recurrence.
 */
const getNextRecurrenceDateByWeekday = (
  intervalInWeeks: number,
  recurrenceWeekdays: DayOfWeek[], // e.g. ['Monday', 'Friday']
  startingDate: Date,
): Date | null => {
  const sortedWeekdays = recurrenceWeekdays
    .map((day) => weekdayMap[day])
    .sort((a, b) => a - b);

  // const currentDate = new Date(Date.now());
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(startingDate);
    checkDate.setDate(startingDate.getDate() + i);

    //Getting the weekday number 0 (Sun) to 6 (Sat)
    const dayOfWeek = checkDate.getDay();

    if (sortedWeekdays.includes(dayOfWeek)) {
      //Adding intervalInWeeks to the result date
      checkDate.setDate(checkDate.getDate() + (intervalInWeeks - 1) * 7);
      console.log(`Next date is: ${checkDate.toDateString()}`);
      return checkDate;
    }
  }
  return null; // No matching weekday found within the next 7 days
};

/**
 * Calculates the next recurrence date based on the specified interval in months
 * and the desired weekday of the month for recurrence.
 */
const getNextRecurrenceDateMonthlyByWeekday = (
  recurrence: workOrderRecurrence,
  startingDate: Date,
) => {
  const { week, day } = recurrence.details.weekdayOfMonth;
  // const currentDate = new Date(Date.now());

  // Calculate the target month
  let targetMonth = new Date(
    Date.UTC(
      startingDate.getFullYear(),
      startingDate.getMonth() + recurrence.interval,
      1,
    ),
  );
  // Get the weekday number for the target day (e.g., Monday = 1)
  const targetWeekday = weekdayMap[day];

  // Find the first occurrence of the target weekday in the target month
  let firstDayOfMonth = targetMonth.getDay();
  let dayOfMonth = 1 + ((targetWeekday - firstDayOfMonth + 7) % 7);

  // Adjust for the specific week (e.g., '2nd', '3rd', 'last')
  if (week !== '1st' && week !== 'last') {
    const weekNumber = parseInt(week[0]!, 10); // Convert '2nd', '3rd', etc., to 2, 3, etc.
    dayOfMonth += (weekNumber - 1) * 7;
  }

  // Handle the 'last' week case
  if (week === 'last') {
    const lastDayOfMonth = new Date(
      Date.UTC(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0, // Last day of the target month
      ),
    ).getDate();

    while (dayOfMonth + 7 <= lastDayOfMonth) {
      dayOfMonth += 7;
    }
  }

  // Set the calculated day of the month
  targetMonth.setUTCDate(dayOfMonth);
  return targetMonth;
};

export const workOrderHooks = {
  afterChange: (async ({ req, doc, operation, context }) => {
    // Prevent endless loop: skip if this is an internal update
    if (context.skipRecurrenceUpdate) {
      return doc;
    }

    const user = req.user;
    const tenantWorkingDays = (user?.tenants?.[0]?.tenant as Tenant).settings
      ?.workingDays;

    const workingDays =
      tenantWorkingDays && tenantWorkingDays.length > 0
        ? tenantWorkingDays
        : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    // console.log((user?.tenants?.[0]?.tenant as Tenant).settings?.workingDays);

    // Creating new work order when a recurrent order is 'done'
    // and calculating the next recurrence date
    if (
      operation === 'update' &&
      doc.status === 'done' &&
      doc.recurrence?.type !== 'none'
    ) {
      const newDate = calculateNewDate({
        recurrence: doc.recurrence,
        startDate: new Date(doc.date.due),
        dueDate: new Date(Date.now()),
        workingDays,
      });
      if (!newDate) {
        console.error('Invalid recurrence date');
        return doc;
      }

      // console.log('New Order Date:', newDate);

      const newWorkOrder = {
        name: doc.name,
        description: doc.description,
        priority: doc.priority,
        recurrence: {
          ...doc.recurrence,
          details: {
            ...doc.recurrence.details,
            daysOfWeek: doc.recurrence.details.daysOfWeek.map(
              (day: { day: DayOfWeek }) => {
                return { day: day.day };
              },
            ),
          },
        },
        assignment: {
          users: doc.assignment?.users || [],
          teams: doc.assignment?.teams || null,
        },
        vendors: doc.vendors.map((vendor: { id: number }) => vendor.id),
        location: doc.location?.id || null,
        asset: doc.asset?.id || null,
        status: 'open' as const,
        date: {
          start: newDate.start.toISOString(),
          due: newDate.due.toISOString(),
        },
        uploads: doc.uploads,
        parent: doc.id,
        createdBy: doc.createdBy,
      };

      try {
        await req.payload.create({
          collection: 'work-orders',
          data: newWorkOrder,
          req,
        });
      } catch (error) {
        console.error('Failed to create new work order:', error);
        if (
          error instanceof Error &&
          error.message.includes('ValidationError')
        ) {
          console.error(
            'Validation error details:',
            JSON.stringify(error, null, 2),
          );
        }
        throw error;
      }

      return doc;
    }

    // Updating the date of a work order when the document is updated or created
    // and calculating the recurrence date
    if (
      doc.recurrence?.type !== 'none' &&
      (operation === 'create' ||
        (operation === 'update' && doc.status !== 'done'))
    ) {
      const newDate = calculateNewDate({
        recurrence: doc.recurrence,
        startDate: new Date(doc.date.start),
        dueDate: new Date(Date.now()),
        workingDays,
      });
      if (!newDate) {
        console.error('Invalid recurrence date');
        return doc;
      }

      // console.log('New Order Date:', newDate);

      // Set the flag to prevent recursion
      context.skipRecurrenceUpdate = true;

      // Explicitly update the document in the database
      try {
        await req.payload.update({
          collection: 'work-orders',
          id: doc.id,
          data: {
            date: {
              start: newDate.start.toISOString(),
              due: newDate.due.toISOString(),
            },
          },
          req,
        });
      } catch (error) {
        console.error('Failed to update work order date:', error);
      }
      return doc;
    }
    return doc;
  }) satisfies CollectionAfterChangeHook,
};
