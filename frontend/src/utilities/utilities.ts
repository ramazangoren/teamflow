export const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const truncateText = (text: string, maxLength: number = 60): string => {
    const firstLine = text.split('\n')[0];
    return firstLine.length > maxLength ? `${firstLine.substring(0, maxLength)}...` : firstLine;
};


export const formatDate = (dateString?: string) => {
    // if (!dateString || dateString === "0001-01-01T00:00:00") {
    if (!dateString) {
        return "Not set";
    }
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
        return email[0].toUpperCase();
    }
    return 'U';
};
