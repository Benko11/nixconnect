import Modal from "@/Components/Modal";
import { Inertia } from "@inertiajs/inertia";
import Button from "../../Styles/Button";

export function DeleteForkModal({ show, onClose, fork }) {
    const handleDeleteFork = (e) => {
        e.preventDefault();

        Inertia.delete(route("posts.fork-delete", { id: fork.id }), {
            onSuccess: onClose,
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleDeleteFork}>
                <Button>Delete</Button>
            </form>
        </Modal>
    );
}
