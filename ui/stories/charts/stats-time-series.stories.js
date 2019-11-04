import hbs from 'htmlbars-inline-precompile';

import EmberObject, { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import moment from 'moment';

export default {
  title: 'Charts|Stats Time Series',
};

const ts = offset =>
  moment()
    .subtract(offset, 'm')
    .toDate();

export const Standard = () => {
  return {
    template: hbs`
      <h5 class="title is-5">Stats Time Series</h5>
      <div class="block" style="height:100px; width: 400px;">
        <StatsTimeSeries @data={{staticMetrics}} @chartClass="is-primary" />
      </div>
      `,
    context: {
      staticMetrics: [
        { timestamp: ts(20), value: 0.5 },
        { timestamp: ts(18), value: 0.5 },
        { timestamp: ts(16), value: 0.4 },
        { timestamp: ts(14), value: 0.3 },
        { timestamp: ts(12), value: 0.9 },
        { timestamp: ts(10), value: 0.3 },
        { timestamp: ts(8), value: 0.3 },
        { timestamp: ts(6), value: 0.4 },
        { timestamp: ts(4), value: 0.5 },
        { timestamp: ts(2), value: 0.6 },
        { timestamp: ts(0), value: 0.6 },
      ],
    },
  };
};

export const HighLowComparison = () => {
  return {
    template: hbs`
      <h5 class="title is-5">Stats Time Series high/low comparison</h5>
      <div class="columns">
        <div class="block column" style="height:200px; width:400px">
          <StatsTimeSeries @data={{data.metricsHigh}} @chartClass="is-info" />
        </div>
        <div class="block column" style="height:200px; width:400px">
          <StatsTimeSeries @data={{data.metricsLow}} @chartClass="is-info" />
        </div>
      </div>
      <p class='annotation'>Line charts, and therefore stats time series charts, use a constant linear gradient with a height equal to the canvas. This makes the color intensity of the gradient at values consistent across charts as long as those charts have the same y-axis domain.</p>
      <p class='annotation'>This is used to great effect with stats charts since they all have a y-axis domain of 0-100%.</p>
    `,
    context: {
      data: EmberObject.extend({
        timerTicks: 0,

        startTimer: on('init', function() {
          this.set(
            'timer',
            setInterval(() => {
              const metricsHigh = this.metricsHigh;
              const prev = metricsHigh.length ? metricsHigh[metricsHigh.length - 1].value : 0.9;
              this.appendTSValue(
                metricsHigh,
                Math.min(Math.max(prev + Math.random() * 0.05 - 0.025, 0.5), 1)
              );

              const metricsLow = this.metricsLow;
              const prev2 = metricsLow.length ? metricsLow[metricsLow.length - 1].value : 0.1;
              this.appendTSValue(
                metricsLow,
                Math.min(Math.max(prev2 + Math.random() * 0.05 - 0.025, 0), 0.5)
              );
            }, 1000)
          );
        }),

        appendTSValue(array, value, maxLength = 300) {
          array.addObject({
            timestamp: Date.now(),
            value,
          });

          if (array.length > maxLength) {
            array.splice(0, array.length - maxLength);
          }
        },

        willDestroy() {
          clearInterval(this.timer);
        },

        metricsHigh: computed(() => {
          return [];
        }),

        metricsLow: computed(() => {
          return [];
        }),

        staticMetrics: computed(() => {
          const ts = offset =>
            moment()
              .subtract(offset, 'm')
              .toDate();
          return [
            { timestamp: ts(20), value: 0.5 },
            { timestamp: ts(18), value: 0.5 },
            { timestamp: ts(16), value: 0.4 },
            { timestamp: ts(14), value: 0.3 },
            { timestamp: ts(12), value: 0.9 },
            { timestamp: ts(10), value: 0.3 },
            { timestamp: ts(8), value: 0.3 },
            { timestamp: ts(6), value: 0.4 },
            { timestamp: ts(4), value: 0.5 },
            { timestamp: ts(2), value: 0.6 },
            { timestamp: ts(0), value: 0.6 },
          ];
        }),

        secondsFormat() {
          return date => moment(date).format('HH:mm:ss');
        },
      }).create(),
    },
  };
};