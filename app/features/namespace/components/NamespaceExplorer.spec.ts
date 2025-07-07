import { describe, expect, it } from "vitest";
import type { NameSpace } from "~/generated/fastAPI.schemas";
import { buildNamespaceTree } from "./NamespaceExplorer";

describe("buildNamespaceTree", () => {
  it("should return top-level resources as root nodes", () => {
    const data: NameSpace = {
      g: {
        nodes: [
          { id: { uid: "1", name: "Resource 1", authors: [], published: "" } },
          { id: { uid: "2", name: "Folder 1" } },
          { id: { uid: "3", name: "Resource 2", authors: [], published: "" } },
        ],
        edges: [{ source: { uid: "2" }, target: { uid: "3" } }],
      },
    };
    const tree = buildNamespaceTree(data);
    expect(tree).toHaveLength(2);
    expect(tree.map((n) => n.uid)).toContain("1");
    expect(tree.map((n) => n.uid)).toContain("2");
  });

  it("should return top-level folders as root nodes", () => {
    const data: NameSpace = {
      g: {
        nodes: [
          { id: { uid: "1", name: "Folder 1" } },
          { id: { uid: "2", name: "Folder 2" } },
          { id: { uid: "3", name: "Resource 1", authors: [], published: "" } },
        ],
        edges: [{ source: { uid: "1" }, target: { uid: "3" } }],
      },
    };
    const tree = buildNamespaceTree(data);
    expect(tree).toHaveLength(2);
    expect(tree.map((n) => n.uid)).toContain("1");
    expect(tree.map((n) => n.uid)).toContain("2");
  });

  it("should correctly build a nested structure", () => {
    const data: NameSpace = {
      g: {
        nodes: [
          { id: { uid: "1", name: "Root Folder" } },
          { id: { uid: "2", name: "Sub Folder" } },
          { id: { uid: "3", name: "Resource 1", authors: [], published: "" } },
          { id: { uid: "4", name: "Resource 2", authors: [], published: "" } },
        ],
        edges: [
          { source: { uid: "1" }, target: { uid: "2" } },
          { source: { uid: "2" }, target: { uid: "3" } },
        ],
      },
    };
    const tree = buildNamespaceTree(data);
    expect(tree).toHaveLength(2); // Root Folder and Resource 2
    const rootFolder = tree.find((n) => n.type === "folder" && n.uid === "1");
    expect(rootFolder).toBeDefined();
    if (rootFolder?.type === "folder") {
      expect(rootFolder.children).toHaveLength(1);
      const subFolder = rootFolder.children[0];
      expect(subFolder.uid).toBe("2");
      if (subFolder.type === "folder") {
        expect(subFolder.children).toHaveLength(1);
        expect(subFolder.children[0].uid).toBe("3");
      }
    }
  });

  it("should handle empty nodes and edges", () => {
    const data: NameSpace = {
      g: {
        nodes: [],
        edges: [],
      },
    };
    const tree = buildNamespaceTree(data);
    expect(tree).toHaveLength(0);
  });

  it("should handle nodes without edges", () => {
    const data: NameSpace = {
      g: {
        nodes: [
          { id: { uid: "1", name: "Resource 1", authors: [], published: "" } },
          { id: { uid: "2", name: "Folder 1" } },
        ],
        edges: [],
      },
    };
    const tree = buildNamespaceTree(data);
    expect(tree).toHaveLength(2);
  });
});
