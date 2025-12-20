import { useAuthStore } from '../../context/AuthContext';

const ProfileHeader = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src={user?.avatar || 'https://i.pravatar.cc/100'}
        alt="Avatar"
        className="h-16 w-16 rounded-full"
      />
      <div>
        <h2 className="text-xl font-semibold">
          {user?.name}
        </h2>
        <p className="text-sm text-gray-600">
          {user?.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
