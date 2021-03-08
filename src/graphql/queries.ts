import gql from 'graphql-tag';

export const GET_LIST = gql`
  query getList($id: String) {
    getList(id: $id) {
      id
      name
      type
    }
  }
`;

export const GET_FILE = gql`
  query getFile($id: String!) {
    getFile(id: $id) {
      id
      name
      text
    }
  }
`;
