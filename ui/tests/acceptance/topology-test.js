import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import a11yAudit from 'nomad-ui/tests/helpers/a11y-audit';
import Topology from 'nomad-ui/tests/pages/topology';

// TODO: Once we settle on the contents of the info panel, the contents
// should also get acceptance tests.
module('Acceptance | topology', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    server.create('job', { createAllocations: false });
  });

  test('it passes an accessibility audit', async function(assert) {
    server.createList('node', 3);
    server.createList('allocation', 5);

    await Topology.visit();
    await a11yAudit(assert);
  });

  test('by default the info panel shows cluster aggregate stats', async function(assert) {
    server.createList('node', 3);
    server.createList('allocation', 5);

    await Topology.visit();
    assert.equal(Topology.infoPanelTitle, 'Cluster Details');
  });

  test('when an allocation is selected, the info panel shows information on the allocation', async function(assert) {
    server.createList('node', 1);
    server.createList('allocation', 5);

    await Topology.visit();

    await Topology.viz.datacenters[0].nodes[0].memoryRects[0].select();
    assert.equal(Topology.infoPanelTitle, 'Allocation Details');
  });

  test('when a node is selected, the info panel shows information on the node', async function(assert) {
    // A high node count is required for node selection
    server.createList('node', 51);
    server.createList('allocation', 5);

    await Topology.visit();

    await Topology.viz.datacenters[0].nodes[0].selectNode();
    assert.equal(Topology.infoPanelTitle, 'Client Details');
  });
});
