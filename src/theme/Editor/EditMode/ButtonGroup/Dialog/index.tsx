import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)({
    '& div.MuiPaper-root': {
        padding: '1.5rem 1.25rem',
        borderRadius: '30px',
    },
    '& div.MuiDialogContent-root': {
        paddingBottom: '.9rem',
    },
});

export default StyledDialog;
