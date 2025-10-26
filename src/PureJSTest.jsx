function PureJSTest() {
  return React.createElement('div', {
    style: {
      padding: '20px',
      backgroundColor: 'lightblue',
      fontSize: '24px',
      color: 'black'
    }
  }, [
    React.createElement('h1', { key: 'title', style: { color: 'red' } }, 'PURE JS COMPONENT'),
    React.createElement('p', { key: 'text' }, 'This is rendered with pure JavaScript, no JSX!')
  ]);
}

export default PureJSTest;