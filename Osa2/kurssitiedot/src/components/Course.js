const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
  }
  
  const Part = ({ name, exercises }) => {
    return (
      <p> {name} {exercises} </p>
    )  
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part =>
          <Part key = {part.id} name = {part.name} exercises = {part.exercises} />
          )}
      </div>
    )
  }
  
  const Total = ({ course }) => {
    var total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return(
      <h4>Total of {total} exercises</h4>
    )
  }

const Course = ({ course}) => {
    return (
      <div>
        <Header course = {course} />
        <Content parts = {course.parts} />
        <Total course={course}/>
      </div>
    )
}

export default Course