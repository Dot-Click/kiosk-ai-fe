import {
  type FC,
  useState,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
} from "react";
import {
  useDropzone,
  type DropzoneState,
  type DropzoneOptions,
} from "react-dropzone";

export type ProfileContextType = DropzoneState & {
  profilePreview: string | undefined;
  clearProfilePreview: () => void;
};

const ProfileContext = createContext<ProfileContextType>({} as any);

export const DynamicProfileProvider: FC<{
  children: ((props: ProfileContextType) => ReactNode) | ReactNode;
}> = ({ children }) => {
  const [profilePreview, setProfilePreview] = useState<string>();

  const onDrop = useCallback(
    (...params: Parameters<NonNullable<DropzoneOptions["onDrop"]>>) => {
      const [acceptedFiles] = params;
      const file = acceptedFiles[0];
      const profileLink = URL.createObjectURL(file);
      setProfilePreview(profileLink);
    },
    []
  );

  const clearProfilePreview = useCallback(() => {
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
      setProfilePreview(undefined);
    }
  }, [profilePreview]);

  const dropzoneState = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5242880, // 5mb
    accept: {
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
  });

  return (
    <ProfileContext.Provider
      value={{ profilePreview, clearProfilePreview, ...dropzoneState }}
    >
      <>
        <input {...dropzoneState.getInputProps()} />
        {typeof children === "function"
          ? children({ profilePreview, clearProfilePreview, ...dropzoneState })
          : children}
      </>
    </ProfileContext.Provider>
  );
};

export const useGlobalDynamicProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useGlobalDynamicProfile must be used within a DynamicProfileProvider"
    );
  }
  return context;
};
