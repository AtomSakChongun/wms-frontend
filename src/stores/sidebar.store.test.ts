import { describe, it, expect, beforeEach } from "vitest";
import { useSidebarStore } from "./sidebar.store";

// Reset store state before each test
beforeEach(() => {
  useSidebarStore.setState({ collapsed: false, mobileOpen: false });
});

describe("useSidebarStore — initial state", () => {
  it("should have collapsed: false as initial value", () => {
    const state = useSidebarStore.getState();
    expect(state.collapsed).toBe(false);
  });

  it("should have mobileOpen: false as initial value", () => {
    const state = useSidebarStore.getState();
    expect(state.mobileOpen).toBe(false);
  });
});

describe("useSidebarStore — openMobile / closeMobile", () => {
  it("openMobile() sets mobileOpen to true", () => {
    const { openMobile } = useSidebarStore.getState();
    openMobile();
    expect(useSidebarStore.getState().mobileOpen).toBe(true);
  });

  it("closeMobile() sets mobileOpen to false", () => {
    // Open first, then close
    useSidebarStore.setState({ mobileOpen: true });
    const { closeMobile } = useSidebarStore.getState();
    closeMobile();
    expect(useSidebarStore.getState().mobileOpen).toBe(false);
  });

  it("closeMobile() is idempotent when already closed", () => {
    const { closeMobile } = useSidebarStore.getState();
    closeMobile();
    expect(useSidebarStore.getState().mobileOpen).toBe(false);
  });

  it("openMobile() is idempotent when already open", () => {
    useSidebarStore.setState({ mobileOpen: true });
    const { openMobile } = useSidebarStore.getState();
    openMobile();
    expect(useSidebarStore.getState().mobileOpen).toBe(true);
  });
});

describe("useSidebarStore — toggle() independence", () => {
  it("toggle() flips collapsed without affecting mobileOpen", () => {
    useSidebarStore.setState({ mobileOpen: true });
    const { toggle } = useSidebarStore.getState();
    toggle();
    const state = useSidebarStore.getState();
    expect(state.collapsed).toBe(true);
    expect(state.mobileOpen).toBe(true); // unchanged
  });

  it("openMobile() does not affect collapsed", () => {
    useSidebarStore.setState({ collapsed: true });
    const { openMobile } = useSidebarStore.getState();
    openMobile();
    const state = useSidebarStore.getState();
    expect(state.collapsed).toBe(true); // unchanged
    expect(state.mobileOpen).toBe(true);
  });

  it("closeMobile() does not affect collapsed", () => {
    useSidebarStore.setState({ collapsed: true, mobileOpen: true });
    const { closeMobile } = useSidebarStore.getState();
    closeMobile();
    const state = useSidebarStore.getState();
    expect(state.collapsed).toBe(true); // unchanged
    expect(state.mobileOpen).toBe(false);
  });
});
