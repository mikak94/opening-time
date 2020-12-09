# Opening time

By given weekly work-time timetable calculates whether a place is open. If open, calculates the closing time. If closed, calculates the opening time.

## Installation

```bash
npm install --save opening-time
```

## Example

Let's say, we have a caffee, that works with given timetable:

| week day | time |
|----------|------|
| Mon | 24 hours |
| Tue | 24 hours |
| Wed | 10:30 - 21:00 |
| Thu | 11:30 - 21:30 |
| Fri | 09:00 - 22:30 |
| Sat | day off |
| Sun | day off |

We can reprsent this complex timetable with an array like so:

```javascript
const timetable = [
  true, // starts with monday
  true, // true means place is open all-day long
  ['10:30', '21:00'],
  ['11:30', '21:30'],
  ['09:00', '22:30'],
  null,  // 'falsy' values mean a day-off
  false,
];
```

Now let's say we want to know if the caffee is open on a given `Date` and also know when it will open:

```javascript
import getNearestWorkTime from 'opening-time';

const testDate = new Date('2018-04-25T09:00'); // Wed, 09:00
const openingTime = getNearestWorkTime(testDate, timetable);
```

And voilà! `openingTime` equals to `{ opensAt: new Date('2018-04-25T10:30') }`

For more examples see the [test suites](src/index.test.js)

## US week

In some countries, like US, a week's first day is Sunday. If the timetable passed to getNearestWorkTime starts with Sunday, make sure to pass the third argument `isUSInput = true` like so:
```javascript
const openingTime = getNearestWorkTime(testDate, usTimetable, true);
```

# License

MIT © Mika Kuliev
