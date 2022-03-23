import React from "react";
import { Table } from "semantic-ui-react";

const TableOfPlayers = ({ players }) => {
    const rows = players.map((player, index) => {
        return (
            <Table.Row key={index}>
                <Table.Cell>{player.address}</Table.Cell>
                <Table.Cell>{player.valueOf}</Table.Cell>
            </Table.Row>
        );
    });
    return rows;
}

export default TableOfPlayers;