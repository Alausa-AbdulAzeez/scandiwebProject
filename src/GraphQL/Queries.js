import { ApolloClient, gql } from "apollo-boost";
// import { client } from "../App";

export const GET_PRODUCTS = gql`
  query {
    categories {
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;
// export const GET_PRODUCTS2 = client.query({
//   query: gql`
//     query {
//       categories {
//         products {
//           id
//           name
//           inStock
//           gallery
//           description
//           category
//           attributes {
//             id
//             name
//             type
//             items {
//               displayValue
//               value
//               id
//             }
//           }
//           prices {
//             currency {
//               symbol
//             }
//             amount
//           }
//           brand
//         }
//       }
//     }
//   `,
// });
