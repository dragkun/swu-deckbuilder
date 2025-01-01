import React from 'react';

import {
  VictoryBar,
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis
} from "victory";

import { patterns } from '../../utils/AspectGradients';

import '../../styles/Math.scss'

const Math = ({ deck }) => {
  const cards = deck?.cards || [];

  // Cost distribution data
  const costData = Object.entries(cards.reduce((acc, card) => {
    acc[card.cost] = (acc[card.cost] || 0) + card.count;
    return acc;
  }, {})).map(([key, value]) => ({ x: key, y: value }));

  // Aspect distribution data
  const aspectData = Object.entries(cards.reduce((acc, card) => {
    const cardAspect = [...card.aspects];
    if (card.aspectDuplicates.length > 0) {
      cardAspect.push(...card.aspectDuplicates);
    }
    const cardAspectLabel = cardAspect.length > 0 ? cardAspect.join('/') : 'Colorless';

    acc[cardAspectLabel] = (acc[cardAspectLabel] || 0) + 1;
    return acc;
  }, {})).map(([key, value], index) => {
    const colors = patterns[key] || { primary: '#95A5A6', secondary: '#BDC3C7' };
    const label = `${key}\nCards by Aspect: ${value}`;
    return {
      x: key,
      y: value,
      colors,
      label
    };
  });

  // Type distribution data
  const typeData = Object.entries(cards.reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1;
    return acc;
  }, {})).map(([key, value]) => ({ x: key, y: value, label: `${key}\nCards by Type: ${value}` }));

  // Rarity distribution data
  const rarityData = Object.entries(cards.reduce((acc, card) => {
    acc[card.rarity.name] = (acc[card.rarity.name] || 0) + 1;
    return acc;
  }, {})).map(([key, value]) => ({ x: key, y: value, label: `${key}\nCards by Rarity: ${value}` }));

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h3 className="graph-header">Cards by Cost</h3>
        <div>
          <VictoryChart
            domainPadding={{ x: 20 }}
            theme={VictoryTheme.clean}
          >
            <VictoryAxis
              dependentAxis
              label="Card Count"
              style={{
                axis: { stroke: "currentColor" },
                tickLabels: { fill: "currentColor" },
                grid: { stroke: "currentColor", opacity: 0.1 },
                axisLabel: { fill: "currentColor", padding: 35 }
              }}
            />
            <VictoryAxis
              crossAxis
              label="Card Cost"
              style={{
                axis: { stroke: "currentColor" },
                tickLabels: { fill: "currentColor" },
                grid: { stroke: "currentColor", opacity: 0.1 },
                axisLabel: { fill: "currentColor", padding: 35 }
              }}
            />

            <VictoryBar
              data={costData}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => datum.y}
              style={{
                data: {
                  fill: "#3b82f6",
                  width: 30
                }
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => ({
                            style: { ...props.style, fill: "gold" }
                          })
                        },
                        {
                          target: "labels",
                          mutation: () => ({ active: true })
                        }
                      ];
                    },
                    onMouseOut: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => ({
                            style: { ...props.style, fill: "#3b82f6" }
                          })
                        },
                        {
                          target: "labels",
                          mutation: () => ({ active: false })
                        }
                      ];
                    }
                  }
                }
              ]}
            />
          </VictoryChart>
        </div>
      </div>
      <div>
        <h3 className="graph-header">Cards by Aspect</h3>
        <div style={{ width: '70%', margin: '0 auto' }}>
            <VictoryPie
              data={aspectData}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => datum.label}
              style={{
                data: {
                  fill: ({ datum }) => {
                    const patternId = `pattern-${datum.x.replace('/', '-')}`;
                    return `url(#${patternId})`;
                  }
                }
              }}
            />
            <svg style={{ height: 0 }}>
              <defs>
                {aspectData.map((datum) => {
                  const patternId = `pattern-${datum.x.replace('/', '-')}`;
                  return (
                    <pattern
                      key={patternId}
                      id={patternId}
                      patternUnits="userSpaceOnUse"
                      width="10"
                      height="10"
                      patternTransform="rotate(45)"
                    >
                      <rect width="10" height="10" fill={datum.colors.primary} />
                      <rect width="5" height="10" fill={datum.colors.secondary} />
                    </pattern>
                  );
                })}
              </defs>
            </svg>
        </div>
      </div>
      <div>
        <h3 className="graph-header">Cards by Type</h3>
        <div style={{ width: '70%', margin: '0 auto' }}>
            <VictoryPie
              data={typeData}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => datum.label}
              theme={VictoryTheme.material}
            />
        </div>
      </div>
      <div>
        <h3 className="graph-header">Cards by Rarity</h3>
        <div style={{ width: '70%', margin: '0 auto' }}>
            <VictoryPie
              data={rarityData}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => datum.label}
              theme={VictoryTheme.material}
            />
        </div>
      </div>
      {/*   <div style={{ height: '300px' }} className="w-full">
                <h3 className="text-center font-bold mb-2">Aspect Distribution</h3>
                <div className="h-[250px]">
                    <Pie options={chartOptions} data={aspectChartData} />
                </div>
            </div>
            <div style={{ height: '300px' }} className="w-full">
                <h3 className="text-center font-bold mb-2">Type Distribution</h3>
                <div className="h-[250px]">
                    <Bar options={chartOptions} data={typeChartData} />
                </div>
            </div>
            <div style={{ height: '300px' }} className="w-full">
                <h3 className="text-center font-bold mb-2">Rarity Distribution</h3>
                <div className="h-[250px]">
                    <Pie options={chartOptions} data={rarityChartData} />
                </div>
            </div> */}
    </div>
  );
};

export default Math;