import { group } from "console";
import { useEffect, useState } from "react";
import AssignmentCard from "../../components/AssignmentCard/AssignmentCard";
import Navbar from "../../components/Navbar/Navbar";
import styles from "../adminPage/adminPage.module.css";
import background from "../assignmentPage/assignmentPage.module.css";

const AssignmentPage = () => {
    const [groups, setGroups] = useState<[]>();
    const [groupIds, setId] = useState<[]>();
    const [assignment, setAssignment] = useState<any>();
    //Get assignment name from query param
    const assignmentName = window.location.search.replace('?', '');
    const getAssignment = async () =>{
        const email = sessionStorage.getItem('Email');
        const assignmentRequest = await fetch(`http://localhost:8000/assignments/${email}/${assignmentName}`);
        let assignmentInfo = await assignmentRequest.json();
        //Save assignment in storage
        sessionStorage.setItem(`${assignmentName}`, JSON.stringify(assignmentInfo));
        setAssignment(JSON.stringify(assignmentInfo));
        setGroups(await assignmentInfo[0].groups);
        //Save group Ids for later
        const groupIds: [] = [];
        const id  = groups?.forEach((group)=>groupIds.push(group['id']));
        setId(groupIds);
    };
    const getStudentInGroup = async () =>{
        await groupIds?.forEach(async (id) => {
            const getStudents = await fetch(`http://localhost:8000/assignments/${id}/${assignmentName}/students`)
            const students = await getStudents.json();
            sessionStorage.setItem(`${id}`, await students);
        })
    }
    useEffect(() => {
        getAssignment();
        getStudentInGroup();
    }, []);

    //Someone please style this later :-)
    return(
    <div className={background.background}>
        <div className="four wide column">
            <Navbar children={["about", "login", "register", "logout"]} />
            <h1>Assignment : {assignmentName}</h1>
              <div className={styles.assignmentContainer}>
              <div className={styles.assignmentGrid}>
              {groups?.map((group) => (
                <AssignmentCard assignmentName={group['groupName']} buttonText={"Sort"} isAdmin={true} 
                description={'Current members: ' + sessionStorage.getItem(group['id'])}/>
            ))}
              </div>
            </div>
        </div>
    </div>
    )
}

export default AssignmentPage;