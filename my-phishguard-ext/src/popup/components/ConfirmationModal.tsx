import { Modal, Box, Typography, Button, Stack, Alert, AlertTitle } from '@mui/material';
// Import the icons we need
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// The style object for the modal box remains the same
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

interface ConfirmationModalProps {
  isOpen: boolean;
  riskLevel: string;
  riskReason: string;
  onConfirm: () => void;
  onCancel: () => void;
  onReport: () => void;
}

export default function ConfirmationModal({
  isOpen,
  riskLevel,
  riskReason,
  onConfirm,
  onCancel,
  onReport,
}: ConfirmationModalProps) {
  return (
    <Modal open={isOpen} onClose={onCancel}>
      <Box sx={style}>
        <Alert severity="warning" sx={{ '.MuiAlert-icon': { fontSize: '2rem' } }}>
          <AlertTitle sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>PhishGuard Warning</AlertTitle>
          This link has a risk level of: <strong>{riskLevel}</strong>
        </Alert>
        
        <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
          <strong>Reason:</strong> {riskReason}
        </Typography>

        <Typography variant="body1" sx={{ mt: 3, fontWeight: 'bold' }}>
          Do you still want to proceed to this site?
        </Typography>

        {/* --- UPDATED BUTTONS --- */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={onCancel}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onReport}
            startIcon={<ReportProblemIcon />}
          >
            Report
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={onConfirm}
            startIcon={<OpenInNewIcon />}
          >
            Proceed
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}