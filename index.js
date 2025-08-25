const today = new Date()
let officeDays = 0
let percentage = 0
let workDays = countWorkDays(today)
const REQUIRED_PERCENTAJE = 0.6

const renderCalendar = () => {
  const calendarDays = document.querySelectorAll('.calendar__day')
  const { month, monthStartDay, daysInMonth, firstDayGrid } = getDates()
  workDays = countWorkDays(today)
  showInfo(month)

  //place the calendar in the correct start day
  firstDayGrid.style.gridColumnStart = monthStartDay + 1

  //create the event listener for each day
  createEventListener(calendarDays)

  calendarDays.forEach((day) => {
    //remove all
    day.classList.remove('office')
    day.classList.remove('vacation')
    //remove the days if not in month and select the weekends
    day.classList.toggle('hidden', day.dataset.day > daysInMonth)
    day.classList.toggle('weekend', itsWeekend(day.dataset.day))
    if (itsWeekend(day.dataset.day)) {
      deleteEventListener([day])
    }
  })
}

function countWorkDays(today) {
  let day = new Date(`${today.getFullYear()}/${today.getMonth() + 1}/1`)
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()
  numberWorkDays = daysInMonth
  for (let i = 0; i < daysInMonth; i++) {
    if (day.getDay() === 0 || day.getDay() === 6) {
      numberWorkDays--
    }
    day.setDate(day.getDate() + 1)
  }
  return numberWorkDays
}

const itsWeekend = (day) => {
  const monthStart = getFirstDay(today)
  const currentDay = new Date(monthStart)
  currentDay.setDate(monthStart.getDate() + parseInt(day) - 1)

  return currentDay.getDay() === 0 || currentDay.getDay() === 6
}

const getFirstDay = (date) => {
  const firstDay = new Date(`${date.getFullYear()}/${today.getMonth() + 1}/1`)
  return firstDay
}
const getDaysInMonth = (date) => {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()
  return daysInMonth
}

const getDates = () => {
  const month = today.getMonth() + 1
  const monthStartDay = getFirstDay(today).getDay()
  const daysInMonth = getDaysInMonth(today)
  const firstDayGrid = document.querySelector('.calendar__day:first-child')
  return {
    month,
    monthStartDay,
    daysInMonth,
    firstDayGrid,
  }
}

const showInfo = (month) => {
  const title = document.getElementsByClassName('month')

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  for (let i = 0; i < months.length; i++) {
    if (i + 1 === month) {
      title[0].innerText = months[i]
    }
  }
  calculatePercentage(0, 0)
  refreshIdeal()
}

const refreshIdeal = () => {
  let ideal = Math.ceil(REQUIRED_PERCENTAJE * workDays) - officeDays
  const idealText = document.getElementById('ideal')
  if (ideal > 0) {
    idealText.innerText = `Te faltan ${ideal} dias`
  } else {
    idealText.innerText = `Felicidades llegaste al objetivo`
  }
}

const nextMonth = () => {
  today.setMonth(today.getMonth() + 1)
  officeDays = 0
  renderCalendar()
}

const prevMonth = () => {
  today.setMonth(today.getMonth() - 1)
  officeDays = 0
  renderCalendar()
}

const calculatePercentage = (workDays, officeDays) => {
  percentage = Math.floor((officeDays / workDays) * 100 || 0)
  const percentajeInfo = document.getElementById('percentage')
  const selected = document.getElementById('selected')

  percentajeInfo.innerText = `${percentage} %`
  if (percentage / 100 >= REQUIRED_PERCENTAJE) {
    percentajeInfo.style.color = '#00ff00'
  } else {
    percentajeInfo.style.color = 'black'
  }
  selected.innerText = officeDays
}

const onClick = (event) => {
  if (!event.target.classList.contains('vacation')) {
    if (event.target.classList.toggle('office')) {
      officeDays++
      refreshIdeal()
    } else {
      officeDays--
      refreshIdeal()
    }
    calculatePercentage(workDays, officeDays)
  } else {
    event.target.classList.remove('vacation')
    workDays++
    refreshIdeal()
  }
}

const onRightClick = (event) => {
  event.preventDefault()
  if (!event.target.classList.contains('office')) {
    if (event.target.classList.toggle('vacation')) {
      workDays--
      refreshIdeal()
    } else {
      workDays++
      refreshIdeal()
    }
  } else {
    event.target.classList.remove('office')
    officeDays--
    refreshIdeal()
    calculatePercentage(workDays, officeDays)
  }
}

function createEventListener(element) {
  element.forEach((day) => {
    day.addEventListener('click', onClick)
    day.addEventListener('contextmenu', onRightClick)
    // day.addEventListener('touchStart', onTouch)
  })
}

const deleteEventListener = (element) => {
  element.forEach((day) => {
    day.removeEventListener('click', onClick)
    day.removeEventListener('contextmenu', onRightClick)
  })
}

renderCalendar()
