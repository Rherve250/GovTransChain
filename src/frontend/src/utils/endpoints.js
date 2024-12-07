const CreateProfile=async(Profile)=>{ 
  return  await window.canister.GovTransChainApi.CreateProfile(Profile)
}
const getProfile=async()=>{
  return await window.canister.GovTransChainApi.getProfile()
}

const CreateProgram=async(Program)=>{
  return await window.canister.GovTransChainApi.CreateProgram(Program)
}
const CreateStock=async(Stock)=>{
  return await window.canister.GovTransChainApi.CreateStock(Stock)
}

const ChangeRole=async(RolePayload)=>{
  return await window.canister.GovTransChainApi.ChangeRole(RolePayload)
}

const getProfilesByRole=async(Role)=>{
  return await window.canister.GovTransChainApi.getProfilesByRole(Role)
}

const AddLeaderToProgram =async(ProgramId,LeaderId)=>{
  return await window.canister.GovTransChainApi.getProfilesByRole(ProgramId,LeaderId)
}

const CitizenRequest=async(ProgramId)=>{
  return await window.canister.GovTransChainApi.CitizenRequest(ProgramId)
}

const ViewRequest=async(ProgramId)=>{
  return await window.canister.GovTransChainApi.ViewRequest(ProgramId)
}


const ApproveRequest=async(ProgramId,ProfileId)=>{
  return await window.canister.GovTransChainApi.ApproveRequest(ProgramId,ProfileId)
}

const Transfer= async(Payload)=>{
  return await window.canister.GovTransChainApi.ApproveRequest(Payload)
}



export { 
  CreateProfile,
  getProfile
}



