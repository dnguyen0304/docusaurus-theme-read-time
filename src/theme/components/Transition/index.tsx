// TODO(dnguyen0304): Investigate why moving this module to src/components
// throws "ReferenceError: exports is not defined".

// Copied from:
// https://mui.com/material-ui/react-dialog/#transitions
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

export default React.forwardRef(function Transition(
    props: TransitionProps
        & {
            children: React.ReactElement<any, any>;
        },
    ref: React.Ref<unknown>,
) {
    return (
        <Slide
            ref={ref}
            direction='up'
            {...props}
        />
    );
});
