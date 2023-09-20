# EXP에서의 nextjs rendering 활용 방안

우선 ExpOrganizationAuthProvider에서 가져오던 데이터들을 server side rendering 하도록 하는게 좋지않을까

그리고 auth부분을 client로 내려서 정적으로 가져갈 수 있도록 하고,

organization과 user의 정보는 많이 안바뀌므로 특정 시간을 주기로 두고 업데이트 하는방법은 어떨지