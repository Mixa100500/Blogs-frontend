const Notification = ({ info }) => {
  if (info.message === null) {
    return null
  }

  const style = {
    color: info.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderRadius: 5,
    borderStyle: 'solid',
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {info.message}
    </div>
  )
}

export default Notification