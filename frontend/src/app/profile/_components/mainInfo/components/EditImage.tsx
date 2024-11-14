"use client";
import React, {
  useState,
  useCallback,
  MouseEventHandler,
  useMemo,
} from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { toast } from "react-toastify";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import Modal from "@/components/Modal";

interface IProp {
  imgUrl: string;
  userId: string;
}

const EditImage = ({ imgUrl, userId }: IProp) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, reset } = useForm();
  const { updateProfile } = useAuth();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const triggerFileInput = useCallback(() => {
    document.getElementById("fileInput")!.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
        setIsEditing(true);
      }
    },
    [],
  );

  const onCropComplete = useCallback(
    (_croppedArea: unknown, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleSave: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      if (!croppedAreaPixels) {
        toast.error("Failed to update profile");
        return;
      }

      const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels);
      if (croppedImage) {
        const formData = new FormData();
        formData.append("image", croppedImage);
        updateProfile({ data: formData, id: userId });
      } else {
        console.error("Cropped image is null");
        toast.error("Failed to update profile");
      }
      setIsEditing(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = useCallback(() => {
    reset();
    setIsEditing(false);
    setImageSrc(null);
  }, [reset]);

  const EditIcon = useMemo(
    () => (
      <button
        onClick={triggerFileInput}
        className="mt-2 text-blue-500 hover:text-blue-700"
      >
        <FaEdit />
      </button>
    ),
    [triggerFileInput],
  );

  return (
    <>
      <div className="flex flex-col items-center">
        {isEditing && imageSrc ? (
          <>
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-700"
              >
                <FaSave />
              </button>
              <button
                onClick={handleCancel}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          </>
        ) : (
          <>
            <Image
              src={imgUrl || "/profile.png"}
              alt="Profile"
              width={256}
              height={256}
              className="h-64 w-64 hover:cursor-pointer"
              unoptimized={true}
              onClick={openModal}
            />
            {EditIcon}
          </>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          {...register("image")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Image
          src={imgUrl || "/profile.png"}
          alt="Profile"
          width={512}
          height={512}
          className="h-auto w-full"
          unoptimized={true}
        />
      </Modal>
    </>
  );
};

export default React.memo(EditImage);
