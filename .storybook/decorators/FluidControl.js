import React from 'react';

const GLOBAL_NAME = 'grid';

const global = {
  [GLOBAL_NAME]: {
    name: 'Grid',
    description: 'Grid system to control fluidity of components',
    defaultValue: 'none',
    toolbar: {
      icon: 'component',
      items: ['none', 'fullscreen', 'framed', 'boundingbox', 'stretching', 'textflow'],
    },
  },
};

const style = '1px dashed #ccd';

const FullScreen = (props) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'auto',
    }}
    {...props}
  />
);

const Framed = (props) => (
  <div
    style={{
      width: '75vw',
      height: '75vh',
      overflow: 'auto',
    }}
    {...props}
  />
);

const Centered = (props) => (
  <FullScreen>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '100%',
      }}
      {...props}
    />
  </FullScreen>
);

const Cell = ({ top, right, bottom, left, ...props }) => (
  <div
    style={{
      borderTop: top ? style : '',
      borderRight: right ? style : '',
      borderBottom: bottom ? style : '',
      borderLeft: left ? style : '',
    }}
    {...props}
  />
);

const Grid = (props) => {
  return (
    <div
      style={{
        position: 'absolute',
        display: 'grid',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        gridTemplateColumns: '1em min-content 1em auto 1em',
        gridTemplateRows: '1em min-content 1em auto 1em',
      }}
    >
      <Cell right bottom />
      <Cell bottom />
      <Cell right bottom left />
      <Cell bottom />
      <Cell bottom left />

      <Cell right />
      <div {...props} />
      <Cell right left />
      <div {...props} />
      <Cell left />

      <Cell top right bottom />
      <Cell top bottom />
      <Cell top right bottom left />
      <Cell top bottom />
      <Cell top bottom left />

      <Cell right />
      <div {...props} />
      <Cell right left />
      <div {...props} />
      <Cell left />

      <Cell top right />
      <Cell top />
      <Cell top right left />
      <Cell top />
      <Cell top left />
    </div>
  );
};

const Text = (props) => (
  <span
    style={{
      fontFamily: 'system-ui; sans-serif',
      fontSize: '1rem',
    }}
    {...props}
  />
);

const Flow = ({ children }) => (
  <div>
    <Text>Lorem ipsum</Text>
    {children}
    <Text>dolor sit amet.</Text>
  </div>
);

const decorator = (Story, { globals: { [GLOBAL_NAME]: val } }) => {
  if (val === 'none')
    return (
      <Centered>
        <Story />
      </Centered>
    );
  else if (val === 'fullscreen')
    return (
      <FullScreen>
        <Story />
      </FullScreen>
    );
  else if (val === 'framed')
    return (
      <Framed>
        <Story />
      </Framed>
    );
  else if (val === 'boundingbox')
    return (
      <Cell top right bottom left>
        <Story />
      </Cell>
    );
  else if (val === 'stretching')
    return (
      <Grid>
        <Story />
      </Grid>
    );
  else if (val === 'textflow')
    return (
      <Flow>
        <Story />
      </Flow>
    );

  return <Story />;
};

export default {
  global,
  decorator,
};
