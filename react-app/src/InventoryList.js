import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './Navbar';
import { Link } from 'react-router-dom';

class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventories: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch('/api/inventories')
      .then(response => response.json())
      .then(data =>
        this.setState({ inventories: data, isLoading: false })
      )
      .catch(err => {
        console.error('Error fetching inventories:', err);
        this.setState({ isLoading: false });
      });
  }

  removeInv = async (id) => {
    await fetch(`/api/inventory/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log("Remove Done!");

    const updatedInventories =
      this.state.inventories.filter(inv => inv._id !== id);

    this.setState({ inventories: updatedInventories });
  };

  render() {
    const { inventories, isLoading } = this.state;

    if (isLoading) {
      return (
        <div>
          <AppNavbar />
          <Container fluid className="mt-4">
            <p>Loading...</p>
          </Container>
        </div>
      );
    }

    const inventoryList = inventories.map(inventory => {
      return (
        <tr key={inventory._id}>
          <td style={{ whiteSpace: 'nowrap' }}>{inventory.prodname}</td>
          <td>{inventory.qty}</td>
          <td>{inventory.price}</td>
          <td>{inventory.status}</td>
          <td>
            <ButtonGroup>
              <Button size="sm" color="primary" tag={Link} to={"/inventories/" + inventory._id}>
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => this.removeInv(inventory._id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <AppNavbar />
        <Container fluid>
          <div className="float-right">
            <Button
              color="success"
              className="my-4"
              tag={Link}
              to="/inventories/new"
            >
              Add inventory
            </Button>
          </div>

          <h3>Inventory List</h3>

          <Table className="mt-4">
            <thead>
              <tr>
                <th width="20%">Product Name</th>
                <th width="10%">Quantity</th>
                <th width="10%">Price</th>
                <th width="10%">Status</th>
                <th width="20%">Actions</th>
              </tr>
            </thead>
            <tbody>{inventoryList}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default InventoryList;
