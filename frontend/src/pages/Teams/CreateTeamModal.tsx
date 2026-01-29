import { useState } from "react";
import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { teamService, type CreateTeamPayload } from "../../sevices/teamServices";


interface CreateTeamModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateTeamModal = ({ opened, onClose, onCreated }: CreateTeamModalProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const payload: CreateTeamPayload = { name };

    try {
      setLoading(true);
      await teamService.createTeam(payload);
      setName("");
      onClose();
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create new team" centered>
      <Stack>
        <TextInput
          label="Team name"
          placeholder="Engineering"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <Button loading={loading} onClick={handleSubmit}>
          Create team
        </Button>
      </Stack>
    </Modal>
  );
};

export default CreateTeamModal;