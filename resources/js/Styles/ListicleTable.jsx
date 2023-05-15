import styled from "styled-components";

const ListicleTable = styled.table`
    border-collapse: collapse;
    th,
    td {
        padding: 0.25rem 1.5rem;
    }

    td {
        padding: 0.25rem 0.75rem;
    }

    th {
        text-align: right;
    }

    .category {
        background-color: var(--secondary-colour);
    }
`;
export default ListicleTable;
