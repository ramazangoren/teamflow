import { useState } from "react";
import {
  Modal,
  TextInput,
  Select,
  Stack,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserPlus } from "lucide-react";
import { teamService, type AddMemberData } from "../../sevices/teamServices";

interface AddMemberModalProps {
  opened: boolean;
  onClose: () => void;
  teamId: string;
  onMemberAdded: () => void;
}

const AddMemberModal = ({
  opened,
  onClose,
  teamId,
  onMemberAdded,
}: AddMemberModalProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<AddMemberData>({
    initialValues: {
      email: "",
      role: "Member",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: AddMemberData) => {
    try {
      setLoading(true);
      await teamService.addMember(teamId, values);
      onMemberAdded();
      form.reset();
      onClose();
    } catch (err: any) {
      console.error("Failed to add member:", err);
      if (err.response?.status === 404) {
        form.setFieldError("email", "User not found with this email");
      } else if (err.response?.status === 400) {
        alert("User is already a member of this team");
      } else {
        alert("Failed to add member");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Team Member" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email Address"
            placeholder="member@example.com"
            required
            {...form.getInputProps("email")}
          />

          <Select
            label="Role"
            data={[
              { value: "Member", label: "Member" },
              { value: "Admin", label: "Admin" },
            ]}
            {...form.getInputProps("role")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              leftSection={<UserPlus size={16} />}
              loading={loading}
              style={{ background: "#667eea" }}
            >
              Add Member
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddMemberModal;