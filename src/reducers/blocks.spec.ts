import mockFetch from "cross-fetch";

import reducer, { initialState, fetchNodeBlocks } from "./blocks";

jest.mock("cross-fetch");

const mockedFetch: jest.Mock<unknown> = mockFetch as any;

const node = {
  url: "http://localhost:3002",
  online: false,
  name: "Node 1",
  loading: false,
};

const block = {
  id: "1",
  attributes: {
    data: "Lorem Ipsum",
  },
};

describe("Reducers::Blocks", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };

    expect(reducer(undefined, action)).toEqual(initialState);
  });

  it("should handle fetchNodeBlocks.pending", () => {
    const action = { type: fetchNodeBlocks.pending, meta: { arg: node } };

    expect(reducer(initialState, action)).toEqual(
      expect.objectContaining({ loading: true })
    );
  });

  it("should handle fetchNodeBlocks.fulfilled", () => {
    const action = {
      type: fetchNodeBlocks.fulfilled,
      meta: { arg: node },
      payload: [block],
    };

    const blocksState = reducer(initialState, action);

    expect(blocksState.list.length).toBeGreaterThan(0);
    expect(blocksState.list).toContain(block);
  });

  it("should handle fetchNodeBlocks.rejected", () => {
    const action = {
      type: fetchNodeBlocks.rejected,
      meta: { arg: node },
      payload: [block],
    };

    const blocksState = reducer(initialState, action);

    expect(blocksState.list.length).toBe(0);
    expect(blocksState.list).not.toContain(block);
  });
});

describe("Actions::Blocks", () => {
  const dispatch = jest.fn();
  const blocks = [block];

  afterAll(() => {
    dispatch.mockClear();
    mockedFetch.mockClear();
  });

  it("should fetch the node blocks", async () => {
    mockedFetch.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ data: blocks });
        },
      })
    );

    const { payload } = await fetchNodeBlocks(node)(dispatch, () => {}, {});

    const calls = dispatch.mock.calls.flat();

    expect(payload).toEqual(blocks);
    expect(calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: fetchNodeBlocks.pending.type,
        }),
        expect.objectContaining({
          type: fetchNodeBlocks.fulfilled.type,
        }),
      ])
    );
  });

  it("should fail to fetch the node blocks", async () => {
    mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Network Error")));

    const { payload } = await fetchNodeBlocks(node)(dispatch, () => {}, {});

    const calls = dispatch.mock.calls.flat();

    expect(payload).not.toEqual(blocks);
    expect(calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: fetchNodeBlocks.pending.type,
        }),
        expect.objectContaining({
          type: fetchNodeBlocks.rejected.type,
        }),
      ])
    );
  });
});
