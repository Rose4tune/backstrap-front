import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import MyLayout from "@layouts/MyLayout";
import { ProfileEditForm } from "src/components/mypage/profile";
import { useStore } from "@stores/useStore.hook";
import editUser from "src/apis/user/editUser";
import LinkCopyToast from "@common/toast/LinkCopyToast";

const ProfileEditPage = () => {
    const { UserStore } = useStore();
    const [isUpdating, setIsUpdating] = useState(false);

    // Toast 상태 관리
    const [toastMessage, setToastMessage] = useState<string>("");
    const [isToastVisible, setIsToastVisible] = useState(false);

    // 로컬 상태 관리
    const [localNickname, setLocalNickname] = useState<string>("");
    const [localPassword, setLocalPassword] = useState<string>("");
    const [researchKeywords, setResearchKeywords] = useState<string[]>([
        "Coral Reef Ecology",
        "Climate Change Biology",
        "Marine Conservation",
        "Molecular Ecology"
    ]);
    const user = UserStore.getMe();

    // Toast 표시 함수
    const showToast = (message: string) => {
        setToastMessage(message);
        setIsToastVisible(true);
        setTimeout(() => {
            setIsToastVisible(false);
        }, 3000);
    };

    const handleProfileImageChange = async (imageUrl: string) => {
        try {
            setIsUpdating(true);
            const result = await editUser(
                { profileImageUrl: imageUrl },
                UserStore.accessToken
            );

            if (result.success) {
                UserStore.refetch();
                showToast("프로필 이미지가 성공적으로 업데이트되었습니다.");
            } else {
                showToast(result.messages || "프로필 이미지 업데이트에 실패했습니다.");
            }
        } catch (error) {
            console.error("Profile image update error:", error);
            showToast("프로필 이미지 업데이트 중 오류가 발생했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleNicknameChange = (nickname: string) => {
        setLocalNickname(nickname);
    };

    const handlePasswordChange = (password: string) => {
        setLocalPassword(password);
    };

    const handleResearchKeywordAdd = (keyword: string) => {
        if (!researchKeywords.includes(keyword)) {
            setResearchKeywords([...researchKeywords, keyword]);
        }
    };

    const handleResearchKeywordRemove = (keyword: string) => {
        setResearchKeywords(researchKeywords.filter(k => k !== keyword));
    };

    const handleSave = async () => {
        try {
            setIsUpdating(true);

            const updateData: any = {};
            if (localNickname && localNickname !== user.name) {
                updateData.name = localNickname;
            }
            if (localPassword && localPassword !== "123456") {
                updateData.password = localPassword;
            }

            if (Object.keys(updateData).length > 0) {
                const result = await editUser(updateData, UserStore.accessToken);

                if (result.success) {
                    UserStore.refetch();
                    showToast("회원정보가 성공적으로 업데이트되었습니다.");
                } else {
                    showToast(result.messages || "회원정보 업데이트에 실패했습니다.");
                }
            } else {
                showToast("변경된 정보가 없습니다.");
            }
        } catch (error) {
            console.error("Update error:", error);
            showToast("업데이트 중 오류가 발생했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <MyLayout>
            <ProfileEditForm
                name={user.realName || "최인영"}
                nickname={localNickname || user.name}
                email={user.email || "example@university.ac.kr"}
                phone={user.phone || "010-0000-0000"}
                password="" // 비밀번호는 보안상 서버에서 안 내려옴
                profileImageUrl={user.profileImageUrl}
                researchKeywords={researchKeywords}
                accessToken={UserStore.accessToken}
                isUpdating={isUpdating}
                onProfileImageChange={handleProfileImageChange}
                onNicknameChange={handleNicknameChange}
                onPasswordChange={handlePasswordChange}
                onResearchKeywordAdd={handleResearchKeywordAdd}
                onResearchKeywordRemove={handleResearchKeywordRemove}
                onSave={handleSave}
            />
            <LinkCopyToast
                message={toastMessage}
                isVisible={isToastVisible}
            />
        </MyLayout>
    );
};

export default observer(ProfileEditPage);