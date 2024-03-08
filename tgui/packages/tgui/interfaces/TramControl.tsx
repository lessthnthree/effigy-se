import { BooleanLike } from 'common/react';
import { useState } from 'react';

import { useBackend } from '../backend';
import { Box, Button, Dimmer, Icon, Section, Stack } from '../components';
import { Window } from '../layouts';

type Data = {
  broken: BooleanLike;
  destinations: Dest[];
  moving: BooleanLike;
  tram_location: string;
};

type Dest = {
  dest_icons: Record<string, string>;
  id: number;
  name: string;
};

const DEPARTMENT2COLOR = {
  // Station
  Arrivals: 'black',
  Service: 'olive',
  Command: 'blue',
  Security: 'red',
  Medical: 'teal',
  Engineering: 'yellow',
  Cargo: 'brown',
  Science: 'purple',
  Departures: 'white',
  // Hilbert Research Facility
  Reception: 'white',
  Botany: 'olive',
  Chemistry: 'teal',
  Processing: 'brown',
  Xenobiology: 'purple',
  Ordnance: 'yellow',
  Office: 'red',
  Dormitories: 'black',
  // EffigyEdit Add - Sigma Octantis
  'Supermatter Satellite': 'purple',
} as const;

const COLOR2BLURB = {
  blue: "This is the tram's current location.",
  green: 'This is the selected destination.',
  transparent: 'Click to set destination.',
} as const;

const marginNormal = 1;
const marginDipped = 3;

const dipUnderCircle = (dest, dep) => {
  const index = Object.keys(dest.dest_icons).indexOf(dep);
  const dipped = index >= 1 && index <= 2;
  return dipped ? marginDipped : marginNormal;
};

export const TramControl = (props) => {
  const { act, data } = useBackend<Data>();
  const { broken, moving, destinations = [], tram_location } = data;

  const [transitIndex, setTransitIndex] = useState(1);

  return (
    <Window title="Tram Controls" width={620} height={325}>
      <Window.Content>
        {(!!broken && <BrokenTramDimmer />) || (
          <Section fill>
            {!!moving && <MovingTramDimmer />}
            <Stack
              align="center"
              fill
              fontSize="16px"
              justify="space-around"
              vertical
            >
              <Stack.Item>Nanotrasen Transit System</Stack.Item>
              <Stack.Item>
                <Stack fill>
                  {destinations.map((dest) => (
                    <Stack.Item key={dest.name}>
                      <Destination
                        dest={dest}
                        transitIndex={transitIndex}
                        setTransitIndex={setTransitIndex}
                      />
                    </Stack.Item>
                  ))}
                </Stack>
              </Stack.Item>
              <Stack.Item>
                <Button
                  disabled={tram_location === destinations[transitIndex].name}
                  onClick={() =>
                    act('send', {
                      destination: destinations[transitIndex].id,
                    })
                  }
                >
                  Send Tram
                </Button>
              </Stack.Item>
            </Stack>
          </Section>
        )}
      </Window.Content>
    </Window>
  );
};

const BrokenTramDimmer = () => {
  return (
    <Dimmer>
      <Stack vertical>
        <Stack.Item>
          <Icon ml={7} color="red" name="triangle-exclamation" size={10} />
        </Stack.Item>
        <Stack.Item fontSize="14px" color="red">
          Check Tram Controller!
        </Stack.Item>
      </Stack>
    </Dimmer>
  );
};

const MovingTramDimmer = (props) => {
  const { data } = useBackend<Data>();
  const { tram_location } = data;

  return (
    <Dimmer>
      <Stack vertical>
        <Stack.Item>
          <Icon ml={10} name="sync-alt" color="green" size={11} />
        </Stack.Item>
        <Stack.Item mt={5} fontSize="14px" color="green">
          The tram is travelling to {tram_location}!
        </Stack.Item>
      </Stack>
    </Dimmer>
  );
};

const Destination = (props) => {
  const { dest, setTransitIndex, transitIndex } = props;
  const { data } = useBackend<Data>();
  const { destinations = [], tram_location } = data;

  const getDestColor = (dest) => {
    if (!tram_location) return 'bad';
    const here = dest.name === tram_location;
    const selected = transitIndex === destinations.indexOf(dest);
    return here ? 'blue' : selected ? 'green' : 'transparent';
  };

  return (
    <Stack vertical>
      <Stack.Item ml={5}>
        <Button
          mr={4.38}
          color={getDestColor(dest)}
          circular
          compact
          height={4.9}
          width={4.9}
          tooltipPosition="top"
          tooltip={COLOR2BLURB[getDestColor(dest)]}
          onClick={() => setTransitIndex(destinations.indexOf(dest))}
        >
          <Icon ml={-2.3} fontSize="59px" name="circle-o" />
        </Button>
        {(destinations.length - 1 !== destinations.indexOf(dest) && (
          <Section title=" " mt={-7.3} ml={10} mr={-6.1} />
        )) || <Box mt={-2.3} />}
      </Stack.Item>
      {dest.dest_icons && (
        <Stack.Item>
          <Stack>
            {Object.keys(dest.dest_icons).map((dep) => (
              <Stack.Item key={dep} mt={dipUnderCircle(dest, dep)}>
                <Button
                  color={DEPARTMENT2COLOR[dep]}
                  icon={dest.dest_icons[dep]}
                  tooltipPosition="bottom"
                  tooltip={dep}
                  style={{
                    borderRadius: '5em',
                    border: '2px solid white',
                  }}
                />
              </Stack.Item>
            ))}
          </Stack>
        </Stack.Item>
      )}
    </Stack>
  );
};
