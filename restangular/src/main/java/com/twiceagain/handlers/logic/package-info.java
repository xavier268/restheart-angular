/*
 * 
 * (c) Xavier Gandillot <xavier@gandillot.com> 2016
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * These are custome applicationLogicHandlers. They HAVE to extend
 * ApplicationLogicHandler (the bootstrap is checking for that.
 * It does not seem to be possible to pipe successive ApplicationHandlers
 * from the configuration file.
 * Hence it has to be done programmatically, in the handler itself.
 */
package com.twiceagain.handlers.logic;
