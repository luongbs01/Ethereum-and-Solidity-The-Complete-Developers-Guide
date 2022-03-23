import React from "react";

const Table = ({ players }) => {
    const rows = players.map((player, index) => {
        return (
            <tr key={index}>
                <td>{player.address}</td>
                <td>{player.valueOf}</td>
            </tr>
        );
    });
    return rows;
}

export default Table;