// src/InventoryEdit.js
import React, { Component } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import AppNavbar from './Navbar';

// Helper to inject match + history into a class component (for React Router v6)
function withRouter(ComponentToWrap) {
  return function ComponentWithRouterProp(props) {
    const params = useParams();
    const navigate = useNavigate();

    return (
      <ComponentToWrap
        {...props}
        match={{ params }}
        history={{ push: navigate }}
      />
    );
  };
}

class InventoryEdit extends Component {
  // empty template for a new inventory item
  emptyInventory = {
    prodname: '',
    qty: '',
    price: '',
    status: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyInventory
    };
  }

  // load existing inventory when editing (id !== 'new')
  async componentDidMount() {
    const { match } = this.props;

    if (match && match.params && match.params.id !== 'new') {
      const response = await fetch(`/api/inventory/${match.params.id}`);
      const inventory = await response.json();
      this.setState({ item: inventory });
    }
  }

  // keep state in sync with form fields
  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let item = { ...this.state.item };
    item[name] = value;

    this.setState({ item });
  };

  // submit form – POST for new, PUT for existing
  handleSubmit = async (event) => {
    event.preventDefault();
    const { item } = this.state;

    await fetch('/api/inventory', {
      method: item._id ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    // go back to inventory list
    if (this.props.history && this.props.history.push) {
      this.props.history.push('/inventories');
    }
  };

  render() {
    const { item } = this.state;

    const title = (
      <h2 className="mt-3">
        {item._id ? 'Edit Inventory' : 'Add Inventory'}
      </h2>
    );

    return (
      <div>
        <AppNavbar />
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            {/* Product Name */}
            <FormGroup>
              <Label for="prodname" className="h5 mt-3">
                Product Name
              </Label>
              <Input
                type="text"
                name="prodname"
                id="prodname"
                value={item.prodname || ''}
                onChange={this.handleChange}
                autoComplete="prodname"
              />
            </FormGroup>

            {/* Quantity */}
            <FormGroup>
              <Label for="qty" className="h5 mt-3">
                Quantity
              </Label>
              <Input
                type="text"
                name="qty"
                id="qty"
                value={item.qty || ''}
                onChange={this.handleChange}
                autoComplete="qty"
              />
            </FormGroup>

            {/* Price */}
            <FormGroup>
              <Label for="price" className="h5 mt-3">
                Price
              </Label>
              <Input
                type="text"
                name="price"
                id="price"
                value={item.price || ''}
                onChange={this.handleChange}
                autoComplete="price"
              />
            </FormGroup>

            {/* Status */}
            <FormGroup>
              <Label for="status" className="h5 mt-3">
                Status
              </Label>
              <Input
                type="text"
                name="status"
                id="status"
                value={item.status || ''}
                onChange={this.handleChange}
                autoComplete="status"
              />
            </FormGroup>

            {/* Save + Cancel buttons */}
            <FormGroup>
              <Button
                color="primary"
                type="submit"
                className="mt-3"
              >
                Save
              </Button>{' '}
              <Button
                color="secondary"
                className="mt-3"
                tag={Link}
                to="/inventories"
              >
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}

// export wrapped component so class still gets match/history props
export default withRouter(InventoryEdit);
