import { forwardRef, useEffect, useRef } from "react";

interface CheckboxProps {
  indeterminate: boolean;
  [x: string]: any;
}

const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest } : any, ref) => {
    const defaultRef = useRef();
    const resolvedRef : any = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
    );
    }
);

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

export default IndeterminateCheckbox;