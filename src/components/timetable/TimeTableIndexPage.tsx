import getTimeTables from "@api/time-table/getTimeTables";
import DropdownInput from "@common/input/DropdownInput";
import { useStore } from "@stores/useStore.hook";
import { useEffect, useState } from "react";
import { useDimScrollForbidden } from "src/hooks/useDimScrollForbidden";
import { formatSemesterLabel } from "src/utils/timetable/formatSemesterLabel";
import TimeTableControlPannel from "./TimeTableControlPannel";
import TimeTable from "./TimeTable";
import FloatButton from "./FloatButton";
import AddClassListModal from "./AddClassListModal";
import AddManualModal from "./AddManualModal";
import { useMediaQuery } from "@mui/material";
import MobileAddModal from "./mobile/MobileAddModal";
import MobileSettingModal from "./mobile/MobileSettingModal";
import MobileListModal from "./mobile/MobileListModal";
import AddClassListModalMobile from "./mobile/AddClassListModalMobile";
import AddManualModalMobile from "./mobile/AddManualModalMobile";
import { observer } from "mobx-react";
import GradeCalculatorPannel from "./GradeCalculatorPannel";
import { NextSeo } from "next-seo";
import GlobalHeader from "../header/GlobalHeader";
import MobileLayoutTimeTable from "../mobile/timetable/MobileLayoutTimeTable";

function TimeTableIndexPage({
    templateList: ssrTemplateList,
    selectedSemester: ssrSelectedSemester,
    timeTableEntityList: ssrTimeTableEntityList,
    selectedTimeTableEntity: ssrSelectedTimeTableEntity,
    initialUser: ssrUserEntity
}) {
    const [isClassListModalOpen, setIsClassListModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    const [isMobileAddModalOpen, setIsMobileAddModalOpen] = useState<boolean>(false)
    const [isMobileSettingModalOpen, setIsMobileSettingModalOpen] = useState<boolean>(false)
    const [isMobileListModalOpen, setIsMobileListModalOpen] = useState<boolean>(false)

    const [templateList, setTemplateList] = useState(ssrTemplateList || []);
    const [selectedSemester, setSelectedSemester] = useState(ssrSelectedSemester);
    const [timeTableEntityList, setTimeTableEntityList] = useState(ssrTimeTableEntityList || []);
    const [selectedTimeTableEntity, setSelectedTimeTableEntity] = useState(ssrSelectedTimeTableEntity || undefined);
    useDimScrollForbidden(isClassListModalOpen || isManualModalOpen);

    const isMobile = useMediaQuery('(max-width:550px)')

    const { UserStore } = useStore();

    //User SSR Store에 저장 
    useEffect(() => {
        if (ssrUserEntity) {
            UserStore.hydrate(ssrUserEntity)
        }
    }, [ssrUserEntity, UserStore])

    const userUuid = UserStore.getUserId();
    const accessToken = UserStore.getAccessTokenFromCookies()

    // 드롭다운 선택 시 시간표 재조회
    useEffect(() => {
        if (!userUuid || !accessToken || !selectedSemester) return;

        async function fetchSemesterTable() {
            const response = await getTimeTables(
                { semesterType: selectedSemester.semester, userUuid, year: selectedSemester.year },
                accessToken
            );
            if (response.success && response.data) {
                setTimeTableEntityList(response.data);
                const found = response.data.find(
                    (entity) => entity.year === selectedSemester.year && entity.semester === selectedSemester.semester
                );
                setSelectedTimeTableEntity(found || undefined);
            }
        }
        fetchSemesterTable();
    }, [selectedSemester, userUuid, accessToken]);


    return (
        <>
            <NextSeo
                title="가방끈 | 시간표"
                description="대학원 시간표는 가방끈"
                canonical={`https://www.bagstrap.team/timetable/share/${selectedTimeTableEntity?.uuid}`}
                openGraph={{
                    type: 'website',
                    url: `https://www.bagstrap.team/timetable/share/${selectedTimeTableEntity?.uuid}`,
                    title: `${selectedTimeTableEntity?.name}`,
                    description: '대학원 시간표는 가방끈',
                    images: [
                        {
                            url: 'https://www.bagstrap.team/logos/timeTablePreview.png',
                            alt: `${selectedTimeTableEntity?.name}`,
                        },
                    ],
                    site_name: 'Bagstrap',
                }}
            />

            <>
            </>
            {/*main*/}
            {isMobile ?
                <div className="flex flex-col pt-[90px] pb-[120px] max-w-[550px] min-h-screen gap-3 mx-auto">
                    <div className="pl-3 pr-5 pb-3">
                        <TimeTable isMobile={isMobile} timeTableEntityList={timeTableEntityList} setTimeTableEntityList={setTimeTableEntityList} selectedSemester={selectedSemester} selectedTimeTableEntity={selectedTimeTableEntity} setSelectedTimeTableEntity={setSelectedTimeTableEntity} />
                    </div>
                    <div className="px-5">
                        <GradeCalculatorPannel />
                    </div>
                    <MobileLayoutTimeTable setIsMobileAddModalOpen={setIsMobileAddModalOpen} setIsMobileSettingModalOpen={setIsMobileSettingModalOpen} setIsMobileListModalOpen={setIsMobileListModalOpen} selectedTimeTableEntity={selectedTimeTableEntity} />
                </div>
                :

                <div className="flex flex-col pb-[80px] min-w-[1280px] max-w-[1920px] mx-auto">
                    <GlobalHeader />
                    <div className="flex w-full min-w-[1280px] max-w-[1920px] mx-auto px-[80px] gap-20">
                        <div className="w-[280px] min-w-[280px] flex flex-col gap-3">
                            <DropdownInput
                                placeholder={"학기를 선택해주세요."}
                                title={"학기"}
                                onChange={(val) => {
                                    const found = templateList?.find((t) => formatSemesterLabel(t) === val);
                                    if (!found) return;
                                    if (found.year === selectedSemester?.year &&
                                        found.semester === selectedSemester?.semester) return; // 동일하면 무시
                                    setSelectedSemester(found);
                                }}
                                options={templateList?.map(formatSemesterLabel) ?? []}
                                value={formatSemesterLabel(selectedSemester)}
                                needGap />
                            <TimeTableControlPannel
                                selectedTimeTableEntity={selectedTimeTableEntity}
                                setSelectedTimeTableEntity={setSelectedTimeTableEntity}
                                selectedSemester={selectedSemester}
                                timeTableEntityList={timeTableEntityList}
                                setTimeTableEntityList={setTimeTableEntityList} />
                            <GradeCalculatorPannel />
                        </div>
                        <TimeTable timeTableEntityList={timeTableEntityList} setTimeTableEntityList={setTimeTableEntityList} selectedSemester={selectedSemester} selectedTimeTableEntity={selectedTimeTableEntity} setSelectedTimeTableEntity={setSelectedTimeTableEntity} />
                    </div>
                </div>
            }


            {/* 데스크톱용 모달 */}
            {!isMobile && !!selectedTimeTableEntity?.uuid && (
                <FloatButton setIsClassListModalOpen={setIsClassListModalOpen} setIsManualModalOpen={setIsManualModalOpen} />
            )}

            {!isMobile && isClassListModalOpen && <AddClassListModal selectedTimeTableEntity={selectedTimeTableEntity} setSelectedTimeTableEntity={setSelectedTimeTableEntity} selectedSemester={selectedSemester} setIsClassListModalOpen={setIsClassListModalOpen} />}
            {!isMobile && isManualModalOpen && (
                <AddManualModal
                    selectedSemester={selectedSemester}
                    setIsManualModalOpen={setIsManualModalOpen}
                    selectedTimeTableEntity={selectedTimeTableEntity}
                    setSelectedTimeTableEntity={setSelectedTimeTableEntity}
                    timeTableUuid={selectedTimeTableEntity?.uuid}
                />
            )}

            {/* 모바일용 모달 */}
            {isMobile && isMobileAddModalOpen && <MobileAddModal setIsClassListModalOpen={setIsClassListModalOpen} setIsManualModalOpen={setIsManualModalOpen} setIsMobileAddModalOpen={setIsMobileAddModalOpen} />}
            {isMobile && isMobileSettingModalOpen && selectedTimeTableEntity && <MobileSettingModal timeTableEntityList={timeTableEntityList} setTimeTableEntityList={setTimeTableEntityList} setIsMobileSettingModalOpen={setIsMobileSettingModalOpen} selectedSemester={selectedSemester} selectedTimeTableEntity={selectedTimeTableEntity} setSelectedTimeTableEntity={setSelectedTimeTableEntity} />}
            {isMobile && isMobileListModalOpen && <MobileListModal selectedTimeTableEntity={selectedTimeTableEntity} setTimeTableEntityList={setTimeTableEntityList} templateList={templateList} setIsMobileListModalOpen={setIsMobileListModalOpen} setSelectedTimeTableEntity={setSelectedTimeTableEntity} />}

            {isMobile && isClassListModalOpen && <AddClassListModalMobile selectedTimeTableEntity={selectedTimeTableEntity} setSelectedTimeTableEntity={setSelectedTimeTableEntity} selectedSemester={selectedSemester} setIsClassListModalOpen={setIsClassListModalOpen} />}
            {isMobile && isManualModalOpen && <AddManualModalMobile
                selectedSemester={selectedSemester}
                setIsManualModalOpen={setIsManualModalOpen}
                selectedTimeTableEntity={selectedTimeTableEntity}
                setSelectedTimeTableEntity={setSelectedTimeTableEntity}
                timeTableUuid={selectedTimeTableEntity?.uuid}
            />}
        </>

    );
}

export default observer(TimeTableIndexPage)