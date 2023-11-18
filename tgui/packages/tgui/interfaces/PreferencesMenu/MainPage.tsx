import { classes } from 'common/react';
import { sendAct, useBackend, useLocalState } from '../../backend';
import { Autofocus, Box, Button, Dropdown, FitText, Flex, Icon, Input, LabeledList, Popper, Stack, TrackOutsideClicks } from '../../components';
import { createSetPreference, PreferencesMenuData, RandomSetting, ServerData } from './data';
import { CharacterPreview } from '../common/CharacterPreview';
import { RandomizationButton } from './RandomizationButton';
import { ServerPreferencesFetcher } from './ServerPreferencesFetcher';
import { MultiNameInput, NameInput } from './names';
import { Gender, GENDERS } from './preferences/gender';
import features from './preferences/features';
import { FeatureChoicedServerData, FeatureValueInput } from './preferences/features/base';
import { filterMap, sortBy } from 'common/collections';
import { useRandomToggleState } from './useRandomToggleState';
import { createSearch } from 'common/string';

const CLOTHING_CELL_SIZE = 72;
const CLOTHING_SIDEBAR_ROWS = 10;

const CLOTHING_SELECTION_CELL_SIZE = 72;
const CLOTHING_SELECTION_CELL_SIZE_HORIZONTAL = 96;
const CLOTHING_SELECTION_CELL_SIZE_VERTICAL = 135;
const ENTRIES_PER_ROW = 4;
const MAX_ROWS = 2.8;
const CLOTHING_SELECTION_WIDTH = 5.8;
const CLOTHING_SELECTION_MULTIPLIER = 5.3;

const CharacterControls = (props: {
  handleRotate: () => void;
  handleOpenSpecies: () => void;
  handleLoadout: () => void; // EffigyEdit Add Customization
  gender: Gender;
  setGender: (gender: Gender) => void;
  showGender: boolean;
}) => {
  return (
    <Stack>
      <Stack.Item>
        <Button
          onClick={props.handleRotate}
          fontSize="22px"
          icon="undo"
          tooltip="Rotate"
          tooltipPosition="top"
        />
      </Stack.Item>

      <Stack.Item>
        <Button
          onClick={props.handleOpenSpecies}
          fontSize="22px"
          icon="paw"
          tooltip="Species"
          tooltipPosition="top"
        />
      </Stack.Item>

      {props.showGender && (
        <Stack.Item>
          <GenderButton
            gender={props.gender}
            handleSetGender={props.setGender}
          />
        </Stack.Item>
      )}
      {props.handleLoadout && (
        // EffigyEdit Add Customization
        <Stack.Item>
          <Button
            onClick={props.handleLoadout}
            fontSize="22px"
            icon="suitcase"
            tooltip="Show Loadout Menu"
            tooltipPosition="top"
          />
        </Stack.Item>
      )}
    </Stack>
  );
};

const ChoicedSelection = (
  props: {
    name: string;
    catalog: FeatureChoicedServerData;
    selected: string;
    supplementalFeature?: string;
    supplementalValue?: unknown;
    onClose: () => void;
    onSelect: (value: string) => void;
    searchText: string;
    setSearchText: (value: string) => void;
  },
  context
) => {
  const { act } = useBackend<PreferencesMenuData>(context);

  const {
    catalog,
    supplementalFeature,
    supplementalValue,
    searchText,
    setSearchText,
  } = props;

  if (!catalog.icons) {
    return <Box color="red">Provided catalog had no icons!</Box>;
  }

  let search = createSearch(searchText, (name: string) => {
    return name;
  });

  const use_small_supplemental =
    supplementalFeature &&
    (features[supplementalFeature].small_supplemental === true ||
      features[supplementalFeature].small_supplemental === undefined);

  const entryCount = Object.keys(catalog.icons).length;

  const calculatedWidth =
    CLOTHING_SELECTION_CELL_SIZE_HORIZONTAL *
    Math.min(entryCount, ENTRIES_PER_ROW);
  const baseHeight =
    CLOTHING_SELECTION_CELL_SIZE_VERTICAL *
    Math.min(Math.ceil(entryCount / ENTRIES_PER_ROW), MAX_ROWS);
  const calculatedHeight =
    baseHeight + (supplementalFeature && !use_small_supplemental ? 100 : 0);

  return (
    <Box
      style={{
        background: 'white',
        padding: '5px',

        height: `${
          CLOTHING_SELECTION_CELL_SIZE * CLOTHING_SELECTION_MULTIPLIER
        }px`,
        width: `${CLOTHING_SELECTION_CELL_SIZE * CLOTHING_SELECTION_WIDTH}px`,
      }}>
      <Stack vertical fill>
        <Stack.Item>
          <Stack fill>
            {supplementalFeature && use_small_supplemental && (
              <Stack.Item>
                <FeatureValueInput
                  act={act}
                  feature={features[supplementalFeature]}
                  featureId={supplementalFeature}
                  shrink
                  value={supplementalValue}
                />
              </Stack.Item>
            )}

            <Stack.Item grow>
              <Box
                style={{
                  'border-bottom': '1px solid #888',
                  'font-weight': 'bold',
                  'font-size': '14px',
                  'text-align': 'center',
                }}>
                Select {props.name.toLowerCase()}
              </Box>
            </Stack.Item>

            <Stack.Item>
              <Button color="red" onClick={props.onClose}>
                X
              </Button>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        {Object.keys(catalog.icons).length > 5 && (
          <Stack.Item>
            <Box>
              <Icon mr={1} name="search" />
              <Input
                autoFocus
                width={`${calculatedWidth - 55}px`}
                placeholder="Search options"
                value={searchText}
                onInput={(_, value) => setSearchText(value)}
              />
            </Box>
          </Stack.Item>
        )}

        <Stack.Item overflowX="hidden" overflowY="auto">
          <Autofocus>
            <Flex wrap>
              {Object.entries(catalog.icons)
                .filter(([n, _]) => searchText?.length < 1 || search(n))
                .map(([name, image], index) => {
                  return (
                    <Flex.Item
                      key={index}
                      basis={`${CLOTHING_SELECTION_CELL_SIZE}px`}
                      style={{
                        padding: '5px',
                      }}>
                      <Button
                        onClick={() => {
                          props.onSelect(name);
                        }}
                        selected={name === props.selected}
                        tooltip={name}
                        tooltipPosition="right"
                        style={{
                          height: `${CLOTHING_SELECTION_CELL_SIZE}px`,
                          width: `${CLOTHING_SELECTION_CELL_SIZE}px`,
                        }}>
                        <Box
                          className={classes([
                            'preferences32x32',
                            image,
                            'centered-image',
                          ])}
                          style={{
                            transform:
                              'translateX(-50%) translateY(-50%) scale(1.4)',
                          }}
                        />
                      </Button>
                      <Box textAlign="center">
                        <FitText
                          maxWidth={CLOTHING_SELECTION_CELL_SIZE}
                          maxFontSize={12}>
                          {name}
                        </FitText>
                      </Box>
                    </Flex.Item>
                  );
                })}
            </Flex>
          </Autofocus>
        </Stack.Item>
        {supplementalFeature && !use_small_supplemental && (
          <>
            <Stack.Item mt={0.25}>
              <Box
                pb={0.25}
                style={{
                  'border-bottom': '1px solid rgba(255, 255, 255, 0.1)',
                  'font-weight': 'bold',
                  'font-size': '14px',
                  'text-align': 'center',
                }}>
                Select {features[supplementalFeature].name}
              </Box>
            </Stack.Item>
            <Stack.Item shrink mt={0.5}>
              <FeatureValueInput
                act={act}
                feature={features[supplementalFeature]}
                featureId={supplementalFeature}
                shrink
                value={supplementalValue}
              />
            </Stack.Item>
          </>
        )}
      </Stack>
    </Box>
  );
};

const GenderButton = (
  props: {
    handleSetGender: (gender: Gender) => void;
    gender: Gender;
  },
  context
) => {
  const [genderMenuOpen, setGenderMenuOpen] = useLocalState(
    context,
    'genderMenuOpen',
    false
  );

  return (
    <Popper
      options={{
        placement: 'right-end',
      }}
      popperContent={
        genderMenuOpen && (
          <Stack backgroundColor="white" ml={0.5} p={0.3}>
            {[Gender.Male, Gender.Female, Gender.Other, Gender.Other2].map(
              (gender) => {
                return (
                  <Stack.Item key={gender}>
                    <Button
                      selected={gender === props.gender}
                      onClick={() => {
                        props.handleSetGender(gender);
                        setGenderMenuOpen(false);
                      }}
                      fontSize="22px"
                      icon={GENDERS[gender].icon}
                      tooltip={GENDERS[gender].text}
                      tooltipPosition="top"
                    />
                  </Stack.Item>
                );
              }
            )}
          </Stack>
        )
      }>
      <Button
        onClick={() => {
          setGenderMenuOpen(!genderMenuOpen);
        }}
        fontSize="22px"
        icon={GENDERS[props.gender].icon}
        tooltip="Gender"
        tooltipPosition="top"
      />
    </Popper>
  );
};

const MainFeature = (
  props: {
    catalog: FeatureChoicedServerData & {
      name: string;
      supplemental_feature?: string;
    };
    currentValue: string;
    isOpen: boolean;
    handleClose: () => void;
    handleOpen: () => void;
    handleSelect: (newClothing: string) => void;
    randomization?: RandomSetting;
    setRandomization: (newSetting: RandomSetting) => void;
  },
  context
) => {
  const { act, data } = useBackend<PreferencesMenuData>(context);

  const {
    catalog,
    currentValue,
    isOpen,
    handleOpen,
    handleClose,
    handleSelect,
    randomization,
    setRandomization,
  } = props;

  const supplementalFeature = catalog.supplemental_feature;
  let [searchText, setSearchText] = useLocalState(
    context,
    catalog.name + '_choiced_search',
    ''
  );
  const handleCloseInternal = () => {
    handleClose();
    setSearchText('');
  };

  return (
    <Popper
      options={{
        placement: 'bottom-start',
      }}
      popperContent={
        isOpen && (
          <TrackOutsideClicks onOutsideClick={props.handleClose}>
            <ChoicedSelection
              name={catalog.name}
              catalog={catalog}
              selected={currentValue}
              supplementalFeature={supplementalFeature}
              supplementalValue={
                supplementalFeature &&
                data.character_preferences.supplemental_features[
                  supplementalFeature
                ]
              }
              onClose={handleClose}
              onSelect={handleSelect}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </TrackOutsideClicks>
        )
      }>
      <Button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            handleOpen();
          }
        }}
        style={{
          height: `${CLOTHING_CELL_SIZE}px`,
          width: `${CLOTHING_CELL_SIZE}px`,
        }}
        position="relative"
        tooltip={catalog.name}
        tooltipPosition="right">
        <Box
          className={classes([
            'preferences32x32',
            catalog.icons![currentValue],
            'centered-image',
          ])}
          style={{
            transform: randomization
              ? 'translateX(-70%) translateY(-70%) scale(1.1)'
              : 'translateX(-50%) translateY(-50%) scale(1.3)',
          }}
        />

        {randomization && (
          <RandomizationButton
            dropdownProps={{
              dropdownStyle: {
                bottom: 0,
                position: 'absolute',
                right: '1px',
              },

              onOpen: (event) => {
                // We're a button inside a button.
                // Did you know that's against the W3C standard? :)
                event.cancelBubble = true;
                event.stopPropagation();
              },
            }}
            value={randomization}
            setValue={setRandomization}
          />
        )}
      </Button>
      <Box
        mt={-0.5}
        mb={1}
        style={{
          height: `24px`,
          width: `${CLOTHING_CELL_SIZE}px`,
          'overflow-wrap': 'anywhere',
        }}
        textAlign="center">
        {catalog.name}
      </Box>
    </Popper>
  );
};

const createSetRandomization =
  (act: typeof sendAct, preference: string) => (newSetting: RandomSetting) => {
    act('set_random_preference', {
      preference,
      value: newSetting,
    });
  };

const sortPreferences = sortBy<[string, unknown]>(([featureId, _]) => {
  const feature = features[featureId];
  return feature?.name;
});

export const PreferenceList = (props: {
  act: typeof sendAct;
  preferences: Record<string, unknown>;
  randomizations: Record<string, RandomSetting>;
  maxHeight: string;
}) => {
  return (
    <Stack.Item
      basis="50%"
      grow
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '4px',
      }}
      overflowX="hidden"
      overflowY="auto"
      maxHeight={props.maxHeight}>
      <LabeledList>
        {sortPreferences(Object.entries(props.preferences)).map(
          ([featureId, value]) => {
            const feature = features[featureId];
            const randomSetting = props.randomizations[featureId];

            if (feature === undefined) {
              return (
                <Stack.Item key={featureId}>
                  <b>Feature {featureId} is not recognized.</b>
                </Stack.Item>
              );
            }

            return (
              <LabeledList.Item
                key={featureId}
                label={feature.name}
                verticalAlign="middle">
                <Stack fill>
                  {randomSetting && (
                    <Stack.Item>
                      <RandomizationButton
                        setValue={createSetRandomization(props.act, featureId)}
                        value={randomSetting}
                      />
                    </Stack.Item>
                  )}

                  <Stack.Item grow>
                    <FeatureValueInput
                      act={props.act}
                      feature={feature}
                      featureId={featureId}
                      value={value}
                    />
                  </Stack.Item>
                </Stack>
              </LabeledList.Item>
            );
          }
        )}
      </LabeledList>
    </Stack.Item>
  );
};

export const getRandomization = (
  preferences: Record<string, unknown>,
  serverData: ServerData | undefined,
  randomBodyEnabled: boolean,
  context
): Record<string, RandomSetting> => {
  if (!serverData) {
    return {};
  }

  const { data } = useBackend<PreferencesMenuData>(context);

  return Object.fromEntries(
    filterMap(Object.keys(preferences), (preferenceKey) => {
      if (serverData.random.randomizable.indexOf(preferenceKey) === -1) {
        return undefined;
      }

      if (!randomBodyEnabled) {
        return undefined;
      }

      return [
        preferenceKey,
        data.character_preferences.randomization[preferenceKey] ||
          RandomSetting.Disabled,
      ];
    })
  );
};

export const MainPage = (
  props: {
    openSpecies: () => void;
  },
  context
) => {
  const { act, data } = useBackend<PreferencesMenuData>(context);
  const [currentClothingMenu, setCurrentClothingMenu] = useLocalState<
    string | null
  >(context, 'currentClothingMenu', null);
  const [multiNameInputOpen, setMultiNameInputOpen] = useLocalState(
    context,
    'multiNameInputOpen',
    false
  );
  const [randomToggleEnabled] = useRandomToggleState(context);

  return (
    <ServerPreferencesFetcher
      render={(serverData) => {
        const currentSpeciesData =
          serverData &&
          serverData.species[data.character_preferences.misc.species];

        const contextualPreferences =
          data.character_preferences.secondary_features || [];

        const mainFeatures = [
          ...Object.entries(data.character_preferences.clothing),
          ...Object.entries(data.character_preferences.features).filter(
            ([featureName]) => {
              if (!currentSpeciesData) {
                return false;
              }

              return (
                currentSpeciesData.enabled_features.indexOf(featureName) !== -1
              );
            }
          ),
        ];

        const randomBodyEnabled =
          data.character_preferences.non_contextual.random_body !==
            RandomSetting.Disabled || randomToggleEnabled;

        const randomizationOfMainFeatures = getRandomization(
          Object.fromEntries(mainFeatures),
          serverData,
          randomBodyEnabled,
          context
        );

        const nonContextualPreferences = {
          ...data.character_preferences.non_contextual,
        };

        if (randomBodyEnabled) {
          nonContextualPreferences['random_species'] =
            data.character_preferences.randomization['species'];
        } else {
          // We can't use random_name/is_accessible because the
          // server doesn't know whether the random toggle is on.
          delete nonContextualPreferences['random_name'];
        }

        return (
          <>
            {multiNameInputOpen && (
              <MultiNameInput
                handleClose={() => setMultiNameInputOpen(false)}
                handleRandomizeName={(preference) =>
                  act('randomize_name', {
                    preference,
                  })
                }
                handleUpdateName={(nameType, value) =>
                  act('set_preference', {
                    preference: nameType,
                    value,
                  })
                }
                names={data.character_preferences.names}
              />
            )}

            <Stack height={`${CLOTHING_SIDEBAR_ROWS * CLOTHING_CELL_SIZE}px`}>
              <Stack.Item fill>
                <Stack vertical fill>
                  <Stack.Item>
                    <CharacterControls
                      gender={data.character_preferences.misc.gender}
                      handleOpenSpecies={props.openSpecies}
                      handleRotate={() => {
                        act('rotate');
                      }}
                      handleLoadout={() => {
                        act('open_loadout');
                      }}
                      setGender={createSetPreference(act, 'gender')}
                      showGender={
                        currentSpeciesData ? !!currentSpeciesData.sexes : true
                      }
                    />
                  </Stack.Item>

                  <Stack.Item grow>
                    <CharacterPreview
                      height="80%" // EffigyEdit Change Customization Original 100
                      id={data.character_preview_view}
                    />
                  </Stack.Item>

                  <Stack.Item
                    // EffigyEdit Add Customization
                    position="relative">
                    <Dropdown
                      width="100%"
                      selected={data.preview_selection}
                      options={data.preview_options}
                      onSelected={(value) =>
                        act('update_preview', {
                          updated_preview: value,
                        })
                      }
                    />
                  </Stack.Item>

                  <Stack.Item position="relative">
                    <NameInput
                      name={data.character_preferences.names[data.name_to_use]}
                      handleUpdateName={createSetPreference(
                        act,
                        data.name_to_use
                      )}
                      openMultiNameInput={() => {
                        setMultiNameInputOpen(true);
                      }}
                    />
                  </Stack.Item>
                </Stack>
              </Stack.Item>

              <Stack.Item fill width={`${CLOTHING_CELL_SIZE * 2 + 15}px`}>
                <Stack height="100%" vertical wrap>
                  {mainFeatures.map(([clothingKey, clothing]) => {
                    const catalog =
                      serverData &&
                      (serverData[clothingKey] as FeatureChoicedServerData & {
                        name: string;
                      });

                    return (
                      catalog && (
                        <Stack.Item key={clothingKey} mt={0.5} px={0.5}>
                          <MainFeature
                            catalog={catalog}
                            currentValue={clothing}
                            isOpen={currentClothingMenu === clothingKey}
                            handleClose={() => {
                              setCurrentClothingMenu(null);
                            }}
                            handleOpen={() => {
                              setCurrentClothingMenu(clothingKey);
                            }}
                            handleSelect={createSetPreference(act, clothingKey)}
                            randomization={
                              randomizationOfMainFeatures[clothingKey]
                            }
                            setRandomization={createSetRandomization(
                              act,
                              clothingKey
                            )}
                          />
                        </Stack.Item>
                      )
                    );
                  })}
                </Stack>
              </Stack.Item>

              <Stack.Item grow basis={0}>
                <Stack vertical fill>
                  <PreferenceList
                    act={act}
                    randomizations={getRandomization(
                      contextualPreferences,
                      serverData,
                      randomBodyEnabled,
                      context
                    )}
                    preferences={contextualPreferences}
                    maxHeight="auto"
                  />

                  <PreferenceList
                    act={act}
                    randomizations={getRandomization(
                      nonContextualPreferences,
                      serverData,
                      randomBodyEnabled,
                      context
                    )}
                    preferences={nonContextualPreferences}
                    maxHeight="auto"
                  />
                </Stack>
              </Stack.Item>
            </Stack>
          </>
        );
      }}
    />
  );
};
