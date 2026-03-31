// =============================================================
// graph.js — Prerequisite Graph Construction + Traversal
// Part of MAT1033c SLC Survival Guide (CourseMesh Architecture)
// =============================================================

// The graph structure will look like:
// {
//   "quadratic_formula": {
//       prerequisites: ["discriminant", "standard_form"],
//       dependents: ["vertex_form"]
//   },
//   ...
// }

// =============================================================
// Build Graph From course.json Structure
// =============================================================
export function buildGraph(course) {
  const graph = {};

  // Initialize nodes
  course.sections.forEach(section => {
    section.formulas.forEach(id => {
      if (!graph[id]) {
        graph[id] = { prerequisites: [], dependents: [] };
      }
    });
  });

  // Fill prerequisites and dependents
  course.sections.forEach(section => {
    section.formulas.forEach(id => {
      const formulaNode = graph[id];

      // Look up the formula JSON metadata, if provided in course.json
      // (Optional: If formula metadata in course.json isn't present,
      //  the loader will fill this in later.)
      const meta = section.formulaMeta?.[id] || {};

      const prereqs = meta.prerequisites || [];

      prereqs.forEach(pre => {
        if (!graph[pre]) {
          graph[pre] = { prerequisites: [], dependents: [] };
        }
        graph[id].prerequisites.push(pre);
        graph[pre].dependents.push(id);
      });
    });
  });

  return graph;
}

// =============================================================
// Get direct prerequisites of a formula
// =============================================================
export function getPrerequisites(graph, formulaId) {
  return graph[formulaId]?.prerequisites || [];
}

// =============================================================
// Get direct dependents of a formula ("what uses this")
// =============================================================
export function getDependents(graph, formulaId) {
  return graph[formulaId]?.dependents || [];
}

// =============================================================
// Get ALL ancestor prerequisites (recursive)
// e.g., prerequisites of prerequisites
// =============================================================
export function getAllPrerequisites(graph, formulaId, seen = new Set()) {
  if (!graph[formulaId]) return [];

  graph[formulaId].prerequisites.forEach(pre => {
    if (!seen.has(pre)) {
      seen.add(pre);
      getAllPrerequisites(graph, pre, seen);
    }
  });

  return Array.from(seen);
}

// =============================================================
// Get ALL dependent formulas (recursive)
// e.g., formulas that depend on this, and formulas that depend on those
// =============================================================
export function getAllDependents(graph, formulaId, seen = new Set()) {
  if (!graph[formulaId]) return [];

  graph[formulaId].dependents.forEach(dep => {
    if (!seen.has(dep)) {
      seen.add(dep);
      getAllDependents(graph, dep, seen);
    }
  });

  return Array.from(seen);
}

// =============================================================
// Detect cycles (should not happen but safe guard)
// Returns an array of cycle paths if any
// =============================================================
export function detectCycles(graph) {
  const cycles = [];

  function dfs(nodeId, stack, visited) {
    if (stack.includes(nodeId)) {
      const cyclePath = [...stack.slice(stack.indexOf(nodeId)), nodeId];
      cycles.push(cyclePath);
      return;
    }
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    stack.push(nodeId);

    graph[nodeId].prerequisites.forEach(pre => {
      dfs(pre, stack, visited);
    });

    stack.pop();
  }

  Object.keys(graph).forEach(id => {
    dfs(id, [], new Set());
  });

  return cycles;
}