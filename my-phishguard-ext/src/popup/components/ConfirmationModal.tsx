import { Modal, Box, Typography, Button, Stack, Alert, AlertTitle } from '@mui/material';

// MUI uses a style object for the main modal box
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

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button variant="text" onClick={onCancel}>
            Go Back
          </Button>
          <Button variant="contained" color="warning" onClick={onReport}>
            Report Phishing
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Proceed Anyway
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}