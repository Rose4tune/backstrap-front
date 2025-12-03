import { useState } from "react";
import MyLayout from "@layouts/MyLayout";
import { ProfileHeader } from "src/components/mypage/profile";
import { useStore } from "@stores/useStore.hook";
import editUser from "src/apis/user/editUser";
import { observer } from "mobx-react";

const MyPageProfilePage = () => {
    const [profileImageUrl, setProfileImageUrl] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const { UserStore } = useStore();

    const user = UserStore.getMe();

    const handleProfileImageChange = async (imageUrl: string) => {
        setIsUpdating(true);
        try {
            // editUser API 호출하여 프로필 이미지 업데이트
            const result = await editUser(
                { profileImageUrl: imageUrl },
                UserStore.accessToken
            );

            if (result.success) {
                setProfileImageUrl(imageUrl);
                // UserStore 업데이트 (필요한 경우)
                UserStore.refreshUser();
                console.log("Profile image updated successfully:", imageUrl);
            } else {
                console.error("Failed to update profile image:", result.messages);
                alert(result.messages || "프로필 이미지 업데이트에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            alert("프로필 이미지 업데이트 중 오류가 발생했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <MyLayout>
            <div className="text-bold-36 leading-[44px] text-gray-90">내 프로필</div>
            <ProfileHeader
                name={user?.realName || "사용자"}
                nickname={user?.name || "닉네임"}
                university={user?.school?.name || "대학교"}
                department={user?.major || "전공 정보"}
                profileImageUrl={profileImageUrl || user?.profileImageUrl}
                onProfileImageChange={handleProfileImageChange}
                accessToken={UserStore.accessToken}
                isUpdating={isUpdating}
            />
        </MyLayout>
    )
}
export default observer(MyPageProfilePage);