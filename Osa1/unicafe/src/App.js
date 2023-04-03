import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const feedback = good + neutral + bad
  const avg = (good - bad) / feedback
  const pos = (good / feedback) * 100

  return (
    <div>
      <Header text={'give feedback'}/>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Header text={'statistics'} />
      {feedback === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={feedback} />
          <StatisticLine text='average' value={avg} />
          <StatisticLine text='positive' value={pos} percent='%' />
        </tbody>
      </table>
    )}  
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value, percent }) => {
  return (
    <tr>
      <th>{text}</th>
      <td>
        {value} {percent}
      </td>
    </tr>
  )
}

export default App