import { observer } from "mobx-react";
import GradNewArticleMobile from "src/components/grad-onboarding/mobile/GradNewArticleMobile";
import { components } from "src/types/api";

interface Props {
    tagList: TagEntityViewDto[] | null
}

type TagEntityViewDto = components['schemas']['TagEntityViewDto']

function MobileGradOnboardingList({ tagList }: Props) {
    return (
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
            <GradNewArticleMobile tagList={tagList} headerNoAction />
        </div>)
}

export default observer(MobileGradOnboardingList)