// lib/graphql/queries.ts
export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        createdBy
        createdAt
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($name: String!, $email: String!, $password: String!, $role: String, $createdBy: ID) {
    register(name: $name, email: $email, password: $password, role: $role, createdBy: $createdBy) {
      token
      user {
        id
        name
        email
        role
        createdBy
        createdAt
      }
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      id
      name
      email
      role
      createdBy
      createdAt
    }
  }
`;

export const USERS_QUERY = `
  query Users {
    users {
      id
      name
      email
      role
      createdBy
      createdAt
    }
  }
`;

export const PRODUCTS_QUERY = `
  query Products($active: Boolean) {
    products(active: $active) {
      id
      name
      code
      description
      stock
      minStock
      unitPrice
      category
      active
      image
      createdAt
    }
  }
`;

export const CREATE_MOVEMENT_MUTATION = `
  mutation CreateMovement(
    $productId: ID!
    $type: String!
    $quantity: Int!
    $unitPrice: Float!
    $notes: String
  ) {
    createMovement(
      productId: $productId
      type: $type
      quantity: $quantity
      unitPrice: $unitPrice
      notes: $notes
    ) {
      id
      product {
        id
        name
      }
      type
      quantity
      unitPrice
      totalValue
      stockBefore
      stockAfter
      createdAt
    }
  }
`;

export const KARDEX_QUERY = `
  query Kardex($productId: ID!) {
    kardex(productId: $productId) {
      id
      type
      quantity
      unitPrice
      totalValue
      stockBefore
      stockAfter
      date
    }
  }
`;

export const SALES_STATS_QUERY = `
  query SalesStats {
    salesStats {
      totalSales
      count
      averageTicket
      dailySales
      weeklySales
      monthlySales
    }
  }
`;

export const SALES_BY_MONTH_QUERY = `
  query SalesByMonth {
    salesByMonth {
      labels
      values
    }
  }
`;

export const SALES_BY_CATEGORY_QUERY = `
  query SalesByCategory {
    salesByCategory {
      labels
      values
    }
  }
`;

export const INVENTORY_TRENDS_QUERY = `
  query InventoryTrends($productId: ID!) {
    inventoryTrends(productId: $productId) {
      labels
      values
    }
  }
`;

export const MOVEMENTS_REPORT_QUERY = `
  query MovementsReport($productId: ID, $type: String, $startDate: String, $endDate: String) {
    movements(productId: $productId, type: $type, startDate: $startDate, endDate: $endDate) {
      id
      product {
        id
        name
        category
      }
      type
      quantity
      unitPrice
      totalValue
      stockBefore
      stockAfter
      notes
      registeredBy {
        name
      }
      createdAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct(
    $name: String!
    $code: String!
    $description: String
    $stock: Int!
    $minStock: Int
    $unitPrice: Float!
    $category: String!
    $image: String
  ) {
    createProduct(
      name: $name
      code: $code
      description: $description
      stock: $stock
      minStock: $minStock
      unitPrice: $unitPrice
      category: $category
      image: $image
    ) {
      id
      name
      code
      description
      stock
      minStock
      unitPrice
      category
      active
      image
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $minStock: Int
    $unitPrice: Float
    $category: String
    $active: Boolean
    $image: String
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      minStock: $minStock
      unitPrice: $unitPrice
      category: $category
      active: $active
      image: $image
    ) {
      id
      name
      code
      description
      stock
      minStock
      unitPrice
      category
      active
      image
      createdAt
    }
  }
`;