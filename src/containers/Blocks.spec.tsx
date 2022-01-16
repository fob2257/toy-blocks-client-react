import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

import Blocks from "./Blocks";
import { initialState as blocksInitialState } from "../reducers/blocks";

const nodes = {
  list: [
    {
      url: "https://thawing-springs-53971.herokuapp.com",
      online: false,
      name: "Node 1",
      loading: false,
    },
  ],
};

const block = {
  id: "1",
  attributes: {
    data: "Lorem Ipsum",
  },
};

describe("<Blocks />", () => {
  const setup = (customBlocksState: {}) => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares)({
      nodes,
      blocks: { ...blocksInitialState, ...customBlocksState, list: [block] },
    });
    return (
      <Provider store={mockStore}>
        <Blocks />
      </Provider>
    );
  };

  it("should render correctly", () => {
    render(setup({}));

    const element = screen.getByText(new RegExp(block.attributes.data, "i"));

    expect(element).toBeInTheDocument();
  });

  it("should render loading message", () => {
    render(setup({ loading: true }));

    const element = screen.queryByText(new RegExp(block.attributes.data, "i"));
    const loadingElement = screen.getByText(/loading/i);

    expect(element).not.toBeInTheDocument();
    expect(loadingElement).toBeInTheDocument();
  });

  it("should render error message", () => {
    render(setup({ error: true }));

    const element = screen.queryByText(new RegExp(block.attributes.data, "i"));
    const errorElement = screen.getByText(/wrong/i);

    expect(element).not.toBeInTheDocument();
    expect(errorElement).toBeInTheDocument();
  });
});
