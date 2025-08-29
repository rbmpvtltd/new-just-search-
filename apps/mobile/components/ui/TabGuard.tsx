// // components/TabGuard.tsx
// import React from 'react';
// import { Pressable } from 'react-native';
// import { useFormContext } from 'react-hook-form';
// import { RelativePathString, useRouter } from 'expo-router';
// import { useFormStepStore } from '@/store/formStepStore';

// interface TabGuardProps {
//   tabKey:
//     | 'personalDetails'
//     | 'qualificationsAndSkills'
//     | 'preferredProfession'
//     | 'attachments';
//   [key: string]: any;
// }

// export default function TabGuard({ tabKey, ...props }: TabGuardProps) {
//   const router = useRouter();
//   const { trigger } = useFormContext();
//   const { isStepComplete } = useFormStepStore();

//   const validateBeforeNavigate = async () => {
//     const tabOrder = [
//       'personalDetails',
//       'qualificationsAndSkills',
//       'preferredProfession',
//       'attachments',
//     ];
//     const targetIndex = tabOrder.indexOf(tabKey);

//     for (let i = 0; i < targetIndex; i++) {
//       if (!isStepComplete(tabOrder[i])) {
//         await trigger(); // Optional: validate current step
//         return;
//       }
//     }

//     router.push(`/${tabKey}` as RelativePathString);
//   };

//   return <Pressable {...props} onPress={validateBeforeNavigate} />;
// }
