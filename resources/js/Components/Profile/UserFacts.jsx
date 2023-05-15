import ListicleTable from "@/Styles/ListicleTable";

export default function UserFacts({ facts }) {
    return (
        <ListicleTable className="my-2">
            <colgroup>
                <col className="category" />
                <col className="value" />
            </colgroup>

            <tbody>
                {facts.map((item) => (
                    <tr key={item.id}>
                        <th>{item.category}</th>
                        <td>{item.pivot.value}</td>
                    </tr>
                ))}
            </tbody>
        </ListicleTable>
    );
}
