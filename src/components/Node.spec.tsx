import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as reactRedux from "react-redux";

import Node from "./Node";
import { initialState as blocksInitialState } from "../reducers/blocks";

const { Provider } = reactRedux;

const node = {
  url: "https://thawing-springs-53971.herokuapp.com",
  online: false,
  name: "Node 1",
  loading: false,
};

const nodes = {
  list: [node],
};

describe("<Node />", () => {
  const setup = (
    props: any = { expanded: false, toggleNodeExpanded: () => {} }
  ) => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares)({
      nodes,
      blocks: blocksInitialState,
    });
    return (
      <Provider store={mockStore}>
        <Node node={node} {...props} />
      </Provider>
    );
  };

  it("should render correctly", () => {
    render(setup());

    const element = screen.getByText(new RegExp(node.name, "i"));

    expect(element).toBeInTheDocument();
  });

  it("should call toggleNodeExpanded", () => {
    let expanded = false;
    const toggleNodeExpanded = jest.fn(() => {
      expanded = !expanded;
    });

    render(setup({ expanded, toggleNodeExpanded }));

    const element = screen.getByText(new RegExp(node.name, "i"));

    fireEvent.click(element);

    const calls = toggleNodeExpanded.mock.calls.flat();

    expect(calls.length).toBeGreaterThan(0);
    expect(expanded).toBeTruthy();
  });

  it("should display 'Unknown' if node has no name", async () => {
    const oldName = node.name;
    node.name = "";

    render(setup());

    let element = screen.queryByText(new RegExp(oldName, "i"));
    expect(element).toBeNull();

    element = screen.getByText(/unknown/i);
    expect(element).toBeInTheDocument();

    node.name = oldName;
  });

  it("should dispatch checkNodeBlocks action if is expanded", async () => {
    const dispatch = jest.fn();
    const useDispatchSpy = jest.spyOn(reactRedux, "useDispatch");
    useDispatchSpy.mockReturnValue(dispatch);

    render(setup({ expanded: true }));

    const element = screen.getByText(new RegExp(node.name, "i"));

    expect(element).toBeInTheDocument();

    const calls = dispatch.mock.calls.flat();

    expect(calls.length).toBeGreaterThan(0);

    useDispatchSpy.mockRestore();
  });
});
