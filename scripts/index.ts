import gulp from 'gulp'
import _ from 'lodash'
import createUsers from './createUsers'

const singleTasks = {
  createUsers,
}

_.keys(singleTasks).forEach(key => gulp.task(key, singleTasks[key]))

const complexTasks = {
  // refreshCustomFields: gulp.series(
  //   'refreshEmployeesCustomFields',
  //   'refreshCoachesCustomFields',
  // ),
}

export default complexTasks

// auto close
gulp.on('stop', ({ uid }) => {
  if (uid === 0) process.exit(0)
})
