import {type ChangeEvent, useState} from "react";

export type  StatusFilter = "all" | "running"  | "exited";

interface FilterBarProps {
    filterByName: (name: string) => void;
    filterByStatus: (status: StatusFilter ) => void;
}

function FilterBar(props: FilterBarProps) {
    const [nameValue, setNameValue] = useState<string>('');
    const [statusValue, setStatusValue] = useState<StatusFilter>("all");

    const handleNameInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setNameValue(e.target.value);
        props.filterByName(e.target.value);
    }

    const handleStatusChange = (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
        const value = e.target.value as StatusFilter;
        setStatusValue(value);
        props.filterByStatus(value);
    }

    return (
        <div className="my-6">
            <h2 className="text-xl">Filter Containers</h2>
            <div className="bevel-outset bg-card text-[11px] p-4 w-fit">
                <input value={nameValue} onChange={handleNameInput} className="border-2 px-2 mr-2" type='text'
                       placeholder="container name..."/>
                <select onChange={handleStatusChange} value={statusValue} name="status" id="status-select">
                    <option value="all">all</option>
                    <option value="running">running</option>
                    <option value="exited">exited</option>
                </select>
            </div>
        </div>
    )
}

export default FilterBar;
