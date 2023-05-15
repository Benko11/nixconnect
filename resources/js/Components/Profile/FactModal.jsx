import Modal from "@/Components/Modal";
import TwoColumnResponsive from "@/Styles/TwoColumnResponsive";
import InputLabel from "@/Components/InputLabel";
import InputErrorInfo from "@/Components/InputErrorInfo";
import Button from "@/Styles/Button";
import { useForm } from "@inertiajs/inertia-react";
import TextInput from "@/Components/TextInput";

export default function FactModal({ show, onClose, categories }) {
    const { data, setData, errors, post, reset } = useForm({
        category: "",
        value: "",
    });

    const handleAddFact = (e) => {
        e.preventDefault();

        post(route("profile.add-fact"), {
            onSuccess: () => {
                reset("category", "value");
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleAddFact}>
                <TwoColumnResponsive>
                    <div>
                        <InputLabel value="Category" forInput="category" />
                        <TextInput
                            type="text"
                            name="category"
                            list="categories"
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            value={data.category}
                        />

                        {categories && categories.length > 0 && (
                            <datalist id="categories">
                                {categories.map((item, index) => (
                                    <option key={index} value={item.category} />
                                ))}
                            </datalist>
                        )}
                        <InputErrorInfo info={errors.category} />
                    </div>
                    <div>
                        <InputLabel value="Value" forInput="value" />
                        <TextInput
                            type="text"
                            name="value"
                            value={data.value}
                            onChange={(e) => setData("value", e.target.value)}
                        />
                        <InputErrorInfo info={errors.value} />
                    </div>
                </TwoColumnResponsive>

                <Button className="mt-1">Add fact</Button>
            </form>
        </Modal>
    );
}
