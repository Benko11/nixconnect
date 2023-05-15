import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Content from "@/Components/Content";
import { Head, Link } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import axios from "axios";

export default function Search(props) {
    const [sent, setSent] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        setSent(true);
        axios
            .get(`/api/search/${query}`)
            .then((res) => res.data)
            .then((data) => setResults(data));
    };

    useEffect(() => {
        if (query === "") {
            setResults({});
            setSent(false);
        }
    }, [query]);

    const showRecentUsers = () => {
        if (props.recentUsers == null || props.recentUsers.length < 1) return;

        return (
            <div>
                <div>Select from the list of recently signed in users:</div>

                <div
                    style={{
                        margin: ".25rem 0",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        width: "100%",
                    }}
                >
                    {props.recentUsers.map((user) => (
                        <div key={user.nickname}>
                            <Link href={`/profile/~${user.nickname}`}>
                                ~{user.nickname}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const showUsers = () => {
        if (!Object.hasOwn(results, "users")) {
            if (sent) return <p>No results found</p>;
            else return null;
        }

        return results.users.map((user) => (
            <div key={user}>
                <Link href={`/profile/~${user.nickname}`}>
                    ~{user.nickname}{" "}
                    {user.first_name &&
                        user.last_name &&
                        `(${user.first_name} ${user.last_name})`}
                </Link>
            </div>
        ));
    };

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title="Search" />

            <div style={{ marginTop: "1rem", marginBottom: "5rem" }}>
                <Content size="800px">
                    {showRecentUsers()}

                    <h2>Search</h2>

                    <form onSubmit={handleSearch}>
                        <div style={{ marginBottom: ".5rem" }}>
                            Search for users all across the application.
                        </div>
                        <TextInput
                            type="text"
                            name="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        {query != "" && <p>Press Enter to search </p>}
                    </form>

                    <div className="mb-2">{showUsers()}</div>
                </Content>
            </div>
        </AuthenticatedLayout>
    );
}
